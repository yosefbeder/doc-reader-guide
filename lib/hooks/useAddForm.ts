import { useEffect, useState } from "react";

import { FormState } from "@/types";

export default function useAddForm(
  formState: FormState,
  resetForm: boolean = true
) {
  const [hideMessage, setHideMessage] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setHideMessage(false);
    if (formState.type === "success" && resetForm)
      setFormKey(formState.resetKey!);
  }, [formState.resetKey]);

  return { hideMessage, setHideMessage, formKey };
}
