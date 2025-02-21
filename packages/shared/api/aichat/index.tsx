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

import { AxiosRequestConfig } from "axios";
import defaultConfig from "PUBLIC_DIR/scripts/config.json";
import { combineUrl } from "../../utils/combineUrl";
import { request } from "../client";
import { XhrSource } from "./xhrSource";

const { api: apiConf, proxy: proxyConf } = defaultConfig;
const { origin: apiOrigin, prefix: apiPrefix } = apiConf;
const { url: proxyURL } = proxyConf;

export async function vectorizeFiles(
  folder_id: number,
  files_id: number[] = [],
) {
  const data = { folder_id, files_id };

  const options: AxiosRequestConfig = {
    method: "post",
    url: `/ai/vectorize`,
    data,
  };

  //   const res = (await request(options)) as TGetReferenceDataRequest;
  const res = await request(options);

  return res;
}

export async function getVectorizeProgress(fileId: number) {
  const options: AxiosRequestConfig = {
    method: "get",
    url: `/ai/vectorize/${fileId}/version`,
  };

  const res = await request(options);

  return res;
}

export async function sendMessage({
  message,
  chat_id = "",
  folder_id,
  files_id,
}: {
  message: string;
  chat_id?: string;
  folder_id: number;
  files_id?: number[];
}) {
  const origin =
    window.ClientConfig?.api?.origin || apiOrigin || window.location.origin;
  const proxy = window.ClientConfig?.proxy?.url || proxyURL;
  const prefix = window.ClientConfig?.api?.prefix || apiPrefix;

  const apiBaseURL = combineUrl(origin, proxy, prefix);

  const xs = XhrSource(`${apiBaseURL}/ai/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: message,
      chat_id,
      folder_id,
      files_id,
    }),
  });

  return xs;
}
