import React, { useState, useCallback, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { TextInput } from "@docspace/shared/components/text-input";
import { Text } from "@docspace/shared/components/text";
import { SaveCancelButtons } from "@docspace/shared/components/save-cancel-buttons";
import { setCompanyInfoSettings } from "@docspace/shared/api/settings";
import { inject, observer } from "mobx-react";
import { toastr } from "@docspace/shared/components/toast";
import { FieldContainer } from "@docspace/shared/components/field-container";
import styled from "styled-components";

import { StyledSettingsComponent } from "./StyledSettings";

const StyledWrapper = styled.div`
  .company-name-input {
    width: 100%;
    max-width: 350px;

    input {
      ${({ theme }) => theme.client.settings.common.input}
    }
  }

  .company-name-description {
    margin-bottom: 16px;
  }

  .field-container {
    margin-bottom: 16px;
  }

  .buttons-wrapper {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const CompanyNameSettingsComponent = ({
  t,
  companyInfoSettingsData,
  getCompanyInfoSettings,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyInfoSettingsData) return;
    setCompanyName(companyInfoSettingsData.companyName || "");
  }, [companyInfoSettingsData]);

  const onChangeCompanyName = (e) => {
    setCompanyName(e.target.value);
  };

  const onSave = useCallback(async () => {
    if (!companyName.trim()) return;

    setIsLoading(true);
    try {
      await setCompanyInfoSettings(
        companyInfoSettingsData?.address || "",
        companyName.trim(),
        companyInfoSettingsData?.email || "",
        companyInfoSettingsData?.phone || "",
        companyInfoSettingsData?.site || "",
      );
      await getCompanyInfoSettings();
      toastr.success(t("Settings:SuccessfullySaveSettingsMessage"));
    } catch (error) {
      toastr.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [companyName, companyInfoSettingsData, getCompanyInfoSettings, t]);

  const onCancel = () => {
    setCompanyName(companyInfoSettingsData?.companyName || "");
  };

  const isDisabled =
    isLoading ||
    !companyName.trim() ||
    companyName === companyInfoSettingsData?.companyName;

  return (
    <StyledSettingsComponent>
      <StyledWrapper>
        <div className="category-item-heading">
          <div className="category-item-title">{t("Settings:CompanyName")}</div>
        </div>
        <div className="category-item-description company-name-description">
          <Text fontSize="13px" fontWeight="400">
            {t("Settings:CompanyNameTitle")}
          </Text>
        </div>
        <FieldContainer
          className="field-container"
          labelText={t("Settings:CompanyName")}
          isVertical
        >
          <TextInput
            className="company-name-input"
            value={companyName}
            onChange={onChangeCompanyName}
            isDisabled={isLoading}
          />
        </FieldContainer>
        <div className="buttons-wrapper">
          <SaveCancelButtons
            className="save-cancel-buttons"
            displaySettings
            onSaveClick={onSave}
            onCancelClick={onCancel}
            saveButtonLabel={t("Common:SaveButton")}
            cancelButtonLabel={t("Common:CancelButton")}
            isDisabled={isDisabled}
          />
        </div>
      </StyledWrapper>
    </StyledSettingsComponent>
  );
};

export const CompanyNameSettings = withTranslation(["Settings", "Common"])(
  inject(({ settingsStore }) => {
    const { companyInfoSettingsData, getCompanyInfoSettings } = settingsStore;

    return {
      companyInfoSettingsData,
      getCompanyInfoSettings,
    };
  })(observer(CompanyNameSettingsComponent)),
);
