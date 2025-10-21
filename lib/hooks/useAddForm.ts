import { useEffect, useState } from "react";

import { FormState } from "@/types";

export default function useAddForm(formState: FormState) {
  const [hideMessage, setHideMessage] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setHideMessage(false);
    if (formState.type === "success")
      setFormKey(formState.resetKey || Date.now());
  }, [formState.resetKey]);

  return { hideMessage, setHideMessage, formKey };
}
