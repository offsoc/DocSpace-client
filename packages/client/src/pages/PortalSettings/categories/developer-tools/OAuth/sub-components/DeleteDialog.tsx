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
import { useTranslation, Trans } from "react-i18next";

import { ModalDialog } from "@docspace/shared/components/modal-dialog";
import { ModalDialogType } from "@docspace/shared/components/modal-dialog/ModalDialog.enums";
import { Button, ButtonSize } from "@docspace/shared/components/button";
import { toastr } from "@docspace/shared/components/toast";
import { TData } from "@docspace/shared/components/toast/Toast.type";

import OAuthStore from "SRC_DIR/store/OAuthStore";

interface DeleteClientDialogProps {
  isVisible?: boolean;
  isGroup?: boolean;
  onClose?: () => void;
  onDelete?: () => Promise<void>;
}

const DeleteClientDialog = (props: DeleteClientDialogProps) => {
  const { t, ready } = useTranslation(["OAuth", "Common"]);
  const { isVisible, isGroup, onClose, onDelete } = props;

  const [isRequestRunning, setIsRequestRunning] = React.useState(false);

  const onDeleteClick = async () => {
    try {
      setIsRequestRunning(true);
      await onDelete?.();

      setIsRequestRunning(true);
      onClose?.();
      toastr.success(
        isGroup
          ? t("OAuth:ApplicationsDeletedSuccessfully")
          : t("OAuth:ApplicationDeletedSuccessfully"),
      );
    } catch (error: unknown) {
      const e = error as TData;
      toastr.error(e);
      onClose?.();
    }
  };

  return (
    <ModalDialog
      isLoading={!ready}
      visible={isVisible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
    >
      <ModalDialog.Header>
        {isGroup ? t("DeleteApplications") : t("DeleteApplication")}
      </ModalDialog.Header>
      <ModalDialog.Body>
        {isGroup ? (
          <Trans t={t} i18nKey="DeleteApplicationsDescription" ns="OAuth" />
        ) : (
          <Trans t={t} i18nKey="DeleteApplicationDescription" ns="OAuth" />
        )}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          className="delete-button"
          key="DeletePortalBtn"
          label={t("Common:OKButton")}
          size={ButtonSize.normal}
          scale
          primary
          isLoading={isRequestRunning}
          onClick={onDeleteClick}
        />
        <Button
          className="cancel-button"
          key="CancelDeleteBtn"
          label={t("Common:CancelButton")}
          size={ButtonSize.normal}
          scale
          isDisabled={isRequestRunning}
          onClick={onClose}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default inject(({ oauthStore }: { oauthStore: OAuthStore }) => {
  const {
    bufferSelection,
    selection,

    setDeleteDialogVisible,
    setActiveClient,
    setSelection,
    deleteClient,
    deleteDialogVisible,
  } = oauthStore;

  const isGroup = selection.length > 1;

  const onClose = () => {
    setDeleteDialogVisible(false);
  };

  const onDelete = async () => {
    if (selection.length) {
      await deleteClient(selection);

      setActiveClient("");
      setSelection("");

      return;
    }
    if (!bufferSelection) return;
    await deleteClient([bufferSelection.clientId]);
    setActiveClient("");
    setSelection("");
  };

  return { isVisible: deleteDialogVisible, isGroup, onClose, onDelete };
})(observer(DeleteClientDialog));
