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

import React from "react";
import { inject, observer } from "mobx-react";

import { BackupStorageType } from "@docspace/shared/enums";

import FilesSelectorInput from "SRC_DIR/components/FilesSelectorInput";
import BackupToPublicRoom from "SRC_DIR/components/dialogs/BackupToPublicRoom";

import ScheduleComponent from "./ScheduleComponent";

class RoomsModule extends React.PureComponent {
  constructor(props) {
    super(props);
    const { setSelectedFolder, isDocumentsDefault, defaultFolderId } = props;

    isDocumentsDefault
      ? setSelectedFolder(defaultFolderId)
      : setSelectedFolder("");
  }

  onSelectFolder = (id) => {
    const { setSelectedFolder } = this.props;

    setSelectedFolder(`${id}`);
  };

  render() {
    const {
      isError,
      isLoadingData,
      savingProcess,
      passedId,
      isSavingProcess,
      isResetProcess,
      isDocumentsDefault,
      backupToPublicRoomVisible,
      ...rest
    } = this.props;

    return (
      <>
        <div className="auto-backup_folder-input">
          <FilesSelectorInput
            onSelectFolder={this.onSelectFolder}
            {...(passedId ? { id: passedId } : { openRoot: true })}
            withoutInitPath={!isDocumentsDefault}
            isError={isError}
            isDisabled={isLoadingData}
            isRoomBackup
            isSelectFolder
            withCreate
          />
        </div>
        {backupToPublicRoomVisible ? (
          <BackupToPublicRoom key="backup-to-public-room-panel" />
        ) : null}
        <ScheduleComponent isLoadingData={isLoadingData} {...rest} />
      </>
    );
  }
}
export default inject(({ backup, dialogsStore }) => {
  const {
    setSelectedFolder,
    selectedFolderId,
    defaultStorageType,
    defaultFolderId,
    isSavingProcess,
    isResetProcess,
  } = backup;

  const { backupToPublicRoomVisible } = dialogsStore;

  const isDocumentsDefault =
    defaultStorageType === `${BackupStorageType.DocumentModuleType}`;

  const passedId = isDocumentsDefault ? defaultFolderId : "";

  return {
    defaultFolderId,
    selectedFolderId,
    setSelectedFolder,
    passedId,
    isSavingProcess,
    isResetProcess,
    isDocumentsDefault,
    backupToPublicRoomVisible,
  };
})(observer(RoomsModule));
