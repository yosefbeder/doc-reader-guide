import Input from "@/components/Input";
import { McqQuiz } from "@/types";

const McqQuizFields = ({
  lectureId,
  defaultValues,
  formId,
}: {
  lectureId: number;
  defaultValues?: McqQuiz;
  formId?: string;
}) => {
  return (
    <div>
      {defaultValues && (
        <input
          type="number"
          name="quiz-id"
          id={`quiz-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="Title"
        icon="book-open"
        type="text"
        name="title"
        id={`quiz-${defaultValues?.id || "new"}-title`}
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
        form={formId}
      />
      {defaultValues ? null : (
        <>
          <label htmlFor="questions" className="block mb-2">
            JSON (optional)
          </label>
          <textarea
            name="questions"
            id="questions"
            className="block mb-4"
          ></textarea>
        </>
      )}
      <input
        type="number"
        id={`quiz-${defaultValues?.id || "new"}-lecture-id`}
        name="lecture-id"
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </div>
  );
};

export default McqQuizFields;
