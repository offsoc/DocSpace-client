// (c) Copyright Ascensio System SIA 2009-2025
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

const { join } = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const crypto = require("crypto");

function generateChecksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");
}

const dstPath = join(__dirname, "../../packages", "runtime.json");
const scriptsDir = join(__dirname, "../../public/scripts");

const getFileList = (dirName) => {
  let files = [];

  const items = readdirSync(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.name == ".DS_Store") continue;

    if (item.isDirectory()) {
      files = [...files, ...getFileList(join(dirName, item.name))];
    } else {
      files.push({ path: join(dirName, item.name), name: item.name });
    }
  }

  return files;
};

const files = getFileList(scriptsDir);

const date = new Date();
const dateString = `${date.getFullYear()}${
  date.getMonth() + 1
}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

const data = {
  date: dateString,
  checksums: {},
};

files.forEach((file) => {
  try {
    let content = readFileSync(file.path);
    let checksum = generateChecksum(content);
    data.checksums[file.name] = checksum;
  } catch (e) {
    console.error("Unable to generateChecksum file ", file.path, e);
  }
});

writeFileSync(dstPath, JSON.stringify(data, null, 2));
