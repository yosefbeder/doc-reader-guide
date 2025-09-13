import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import { Quiz, QuizType } from "@/types";

const QuizFields = ({
  type,
  lectureId,
  defaultValues,
  formId,
  yearId,
}: {
  type: QuizType;
  lectureId: number;
  defaultValues?: Quiz;
  formId?: string;
  yearId: number;
}) => {
  return (
    <>
      {defaultValues && (
        <input
          type="number"
          name="quiz-id"
          id={`${type}-quiz-${defaultValues?.id || "new"}-id`}
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
        id={`${type}-quiz-${defaultValues?.id || "new"}-title`}
        required
        defaultValue={defaultValues?.title}
        form={formId}
      />
      {defaultValues ? null : (
        <div>
          <label htmlFor="questions" className="block mb-2">
            JSON (optional)
          </label>
          <textarea
            name="questions"
            id="questions"
            className="block"
          ></textarea>
        </div>
      )}
      <Checkbox label="Notify?" name="notify" form={formId} />
      <input
        type="number"
        id={`${type}-quiz-${defaultValues?.id || "new"}-lecture-id`}
        name="lecture-id"
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
      <input
        type="number"
        name="year-id"
        id={`link-${defaultValues?.id || "new"}-year-id`}
        className="hidden"
        defaultValue={yearId}
        form={formId}
      />
    </>
  );
};

export default QuizFields;
