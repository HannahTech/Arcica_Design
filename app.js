const http = require("http");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const {
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  SCOPE,
  NUMBER_OF_IMAGES,
} = process.env;

const GOOGLE = require("./google.json");

const PORT = process.env.PORT || 3000;

const IMAGES_DIR = "./static/images";
const IMAGES_PND = "./static/pending";

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

let images = fs.readdirSync(IMAGES_DIR);

http
  .createServer((req, res) => {
    if (req.method !== "GET") {
      return res.end("Invalid Request Method");
    }
    const { url } = req;

    fs.readFile(
      "./static" +
        url +
        (url === "/" ? "index.html" : url.includes(".") ? "" : ".html"),
      async (err, data) => {
        if (url === "/script.js") {
          return res.end(
            Buffer.concat([
              Buffer.from(
                `const images = ${JSON.stringify(
                  images
                    .sort((a, b) => 0.5 - Math.random())
                    .slice(0, Math.min(NUMBER_OF_IMAGES, images.length))
                )};\n\n`
              ),
              data,
            ])
          );
        }
        if (err) {
          if (url === "/sync") {
            return res.end(
              (await syncWithGoogleDrive()) ? "sync successful" : "sync failed"
            );
          }
          return res.end("Invalid Request URL");
        }
        res.end(data);
      }
    );
  })
  .listen(PORT);

console.log(`Server running on port ${PORT}`);

const syncWithGoogleDrive = async () => {
  if (GOOGLE.ACCESS_TOKEN_EXPIRY < Date.now() / 1000 + 300) {
    const { access_token, expires_in } = await (
      await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: GOOGLE.REFRESH_TOKEN,
          grant_type: "refresh_token",
        }),
      })
    ).json();

    GOOGLE.ACCESS_TOKEN = access_token;
    GOOGLE.ACCESS_TOKEN_EXPIRY = parseInt(Date.now() / 1000) + expires_in;

    fs.writeFileSync(
      "./google.json",
      JSON.stringify(GOOGLE, null, 2).replaceAll("\n", "\r\n") + "\r\n"
    );

    // {
    //   access_token: 'ya29.a0AWY7CknFgvjRGmyAAVfTGU5WGuvwauBdXNzkuScXk2ZPuZinMQ6pBmL9690A4gQnVzuWtC81NSda6cOtoqmkI6haxithuVzFG7m1JRnnSBBG4_NH2d7XfgmaD_aoW3uoTVsZZ6gRXYA0X5_Sjo26NpaljsrF0kpJaCgYKAZ8SARMSFQG1tDrpM0eH8iw3mjB5BEntZUO2UQ0167',
    //   expires_in: 3599,
    //   scope: 'https://www.googleapis.com/auth/drive.readonly',
    //   token_type: 'Bearer'
    // }
  }

  const folderId = (
    await (
      await fetch(
        "https://www.googleapis.com/drive/v3/files?q=" +
          encodeURI(
            "name = 'images' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
          ),
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + GOOGLE.ACCESS_TOKEN,
          },
        }
      )
    ).json()
  ).files[0].id;

  // {
  //   kind: 'drive#fileList',
  //   incompleteSearch: false,
  //   files: [
  //     {
  //       kind: 'drive#file',
  //       mimeType: 'application/vnd.google-apps.folder',
  //       id: '1D_Y64c461L7bD1osePKRD4t29vmx20tQ',
  //       name: 'images'
  //     }
  //   ]
  // }

  const files = (
    await (
      await fetch(
        "https://www.googleapis.com/drive/v3/files?q=" +
          encodeURI(
            `'${folderId}' in parents and mimeType contains 'image' and trashed = false`
          ),
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + GOOGLE.ACCESS_TOKEN,
          },
        }
      )
    ).json()
  ).files;

  // {
  //   kind: 'drive#fileList',
  //   incompleteSearch: false,
  //   files: [
  //     {
  //       kind: 'drive#file',
  //       mimeType: 'image/jpeg',
  //       id: '146cy_kJy8nIqhvKc85jUmWm03tPX7lU_',
  //       name: '00.jpg'
  //     },
  //     {
  //       kind: 'drive#file',
  //       mimeType: 'image/jpeg',
  //       id: '18cHzAOtFcBubheuzzwJ0bsa62d1bgiJ6',
  //       name: '01.jpg'
  //     }
  //   ]
  // }

  if (fs.existsSync(IMAGES_PND)) fs.rmdirSync(IMAGES_PND, { recursive: true });
  fs.mkdirSync(IMAGES_PND);

  const downloads = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + GOOGLE.ACCESS_TOKEN,
            },
          }
        )
          .then((res) => {
            const dest = new WritableStream({
              write(chunk) {
                fs.appendFileSync(path.resolve(IMAGES_PND, file.name), chunk);
              },
              close() {
                console.log(`file ${file.name} downloaded`);
                resolve();
              },
              error(err) {
                console.error(`error downloading file ${file.name}: ${err}`);
                reject(err);
              },
            });
            res.body.pipeTo(dest);
          })
          .catch((err) => {
            console.error(`error downloading file ${file.name}: ${err}`);
            reject(err);
          });
      })
  );

  try {
    await Promise.all(downloads);
    console.log("All downloads successful");

    if (fs.existsSync(IMAGES_DIR))
      fs.rmdirSync(IMAGES_DIR, { recursive: true });

    fs.renameSync(IMAGES_PND, IMAGES_DIR);

    images = fs.readdirSync(IMAGES_DIR);

    return true;
  } catch (err) {
    console.error("Some downloads failed:", err);

    if (fs.existsSync(IMAGES_PND))
      fs.rmdirSync(IMAGES_PND, { recursive: true });

    return false;
  }
};

// step 1

// https://accounts.google.com/o/oauth2/v2/auth?
// client_id=549095856330-nuh79ihl6mfrq0f9mlj6hsofnm0m00pv.apps.googleusercontent.com&
// scope=https%3A//www.googleapis.com/auth/drive.readonly&
// response_type=code&
// redirect_uri=https%3A//oauth2.arcica.com/code&
// access_type=offline&
// prompt=consent

// step 2

// const url = 'https://oauth2.googleapis.com/token'
// const data = {
//     code:"4/0AbUR2VPSJo70lzO2_FcvDxAe6oZ-D7LLL0BSDsguQ8gy2j1YfMk1aMDlqGibB8cc42PDlw",
//     client_id:"549095856330-nuh79ihl6mfrq0f9mlj6hsofnm0m00pv.apps.googleusercontent.com",
//     client_secret:"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",
//     redirect_uri:"https://oauth2.arcica.com/code",
//     grant_type:"authorization_code"
//     };
// const customHeaders = {
//     "Content-Type": "application/json",
// }

// fetch(url, {
//     method: "POST",
//     headers: customHeaders,
//     body: JSON.stringify(data),
// })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data);
//     });

// result without propmpt=consent
// {
//     access_token: 'ya29.a0AWY7CkmfGJqYxZ4DV6EIBaT3YOlqtcQya3G7icKuEyzdujiyh6BXsMIJqp4cnkzNzUewYDhM5mUBrBiuBg3NQK8w8q7H_HMtyJ1dt0zIyejlm5Z_KWo1h60oL0EolA82dEGE3GvSiebXbgHMMSY7iPhzpPXuaCgYKAYMSARMSFQG1tDrp_d67UivkkXcQqHpLARcpTw0163',
//     expires_in: 3599,
//     scope: 'https://www.googleapis.com/auth/drive.readonly',
//     token_type: 'Bearer'
//   }

// result with propmpt=consent
// {
//     access_token: 'ya29.a0AWY7Ckn5wzJvOAAxK3gSABC7GqXhdmVEYgV4JVMXiBiQd_JFteHJ3PoHelJovq9wK-SY2X7X7pjW1Z8QJmEklfrlRUsgnGh_jgUw-bwo4N5IDgOycZxLDuRYVQC37vRZ_6YBUuyJmfcDqeBsQ4-BX-Y980uhaCgYKAZMSARMSFQG1tDrpwduF7eW3nFdlSV9APRX7tg0163',
//     expires_in: 3599,
//     refresh_token: '1//01djkFrX09A9jCgYIARAAGAESNwF-L9IrDp8TG-zyKojBfXvi1lBCzdQWmEqTWzeEPyZ0TJ3WVx5iisr-VYjLnQKbloxPey_sQeE',
//     scope: 'https://www.googleapis.com/auth/drive.readonly',
//     token_type: 'Bearer'
//   }
