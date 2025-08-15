import { useEffect, useState } from "react";

import { FormState } from "@/types";

export default function useUpdateDeleteForms(
  updateFormState: FormState,
  deleteFormState: FormState
) {
  const [hideMessage, setHideMessage] = useState(false);

  useEffect(() => {
    setHideMessage(false);
  }, [updateFormState.resetKey, deleteFormState.resetKey]);

  return { hideMessage, setHideMessage };
}
