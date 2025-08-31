"use client";

import React, { useState } from "react";

import Message from "@/components/Message";
import {
  Link as LinkType,
  WrittenQuiz,
  McqQuiz as QuizType,
  User,
} from "@/types";
import Link from "../../components/Link";
import Quiz from "../../components/Quiz";
import { useCategories } from "@/lib/hooks";
import UpdateMcqQuizForm from "./UpdateMcqQuizForm";
import UpdateLinkForm from "./UpdateLinkForm";
import UpdateWrittenQuizForm from "./UpdateWrittenQuizForm";
import { SummaryDetail } from "@/components/SummaryDetail";
import notUpdateable from "@/utils/isUpdateable";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export default function LinksList({
  user,
  lectureId,
  links,
  mcqQuizzes,
  writtenQuizzes,
}: {
  user: User;
  lectureId: number;
  links: LinkType[];
  mcqQuizzes: QuizType[];
  writtenQuizzes: WrittenQuiz[];
}) {
  const { categories, currentCategory, setCurrentCategory } = useCategories(
    links,
    mcqQuizzes,
    writtenQuizzes
  );
  const [current, setCurrent] = useState<{
    type: "link" | "mcq" | "written";
    id: number;
  }>();
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);
  const [selectedMcqQuizzes, setSelectedMcqQuizzes] = useState<number[]>([]);

  const handleLinkCheckbox = (id: number, checked: boolean) => {
    setSelectedLinks((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };
  const handleMcqQuizCheckbox = (id: number, checked: boolean) => {
    setSelectedMcqQuizzes((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleCopy = async () => {
    const selectedLinksData = links
      .filter((l) => selectedLinks.includes(l.id))
      .map((l) => ({
        title: l.title,
        subTitle: l.subTitle || undefined,
        urls: l.urls,
        type: l.type,
        category: l.category,
      }));
    const selectedMcqQuizzesData = mcqQuizzes
      .filter((q) => selectedMcqQuizzes.includes(q.id))
      .map((q) => ({
        title: q.title,
        questions:
          q.questions.map(
            ({
              id,
              creatorId,
              createdAt,
              updatedAt,
              quizId,
              image,
              explanation,
              ...rest
            }) => ({
              image: image || undefined,
              explanation: explanation || undefined,
              ...rest,
            })
          ) || [],
      }));
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          { links: selectedLinksData, mcqQuizzes: selectedMcqQuizzesData },
          null,
          2
        )
      );
      alert("Copied to clipboard!");
    } catch (error) {
      alert("Failed to copy to clipboard: " + error);
    }
  };

  if (categories.length === 0)
    return (
      <Message type="warning" className="my-2">
        No sources have been added yet
      </Message>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Button
          onClick={handleCopy}
          disabled={
            selectedLinks.length === 0 && selectedMcqQuizzes.length === 0
          }
        >
          Export
        </Button>
        <Button
          onClick={() => {
            const allSelected =
              selectedLinks.length === links.length &&
              selectedMcqQuizzes.length === mcqQuizzes.length;
            if (allSelected) {
              setSelectedLinks([]);
              setSelectedMcqQuizzes([]);
            } else {
              setSelectedLinks(links.map((l) => l.id));
              setSelectedMcqQuizzes(mcqQuizzes.map((q) => q.id));
            }
          }}
        >
          {selectedLinks.length === links.length &&
          selectedMcqQuizzes.length === mcqQuizzes.length
            ? "Deselect All"
            : "Select All"}
        </Button>
        <span className="text-xs text-slate-500">
          {selectedLinks.length + selectedMcqQuizzes.length} selected
        </span>
      </div>
      {categories.map((category, index) => {
        const categoryLinks = links.filter(
          (link) => link.category === category
        );
        const categoryOpen = currentCategory === index;

        return (
          <SummaryDetail
            key={index}
            open={categoryOpen}
            toggle={() =>
              setCurrentCategory((prev) => (prev === index ? undefined : index))
            }
          >
            <SummaryDetail.Summary>
              <span>{category === "Data" ? "External" : category}</span>
              <span className="text-sm">
                (
                {categoryLinks.length +
                  (category === "Questions"
                    ? mcqQuizzes.length + writtenQuizzes.length
                    : 0)}
                )
              </span>
            </SummaryDetail.Summary>

            <SummaryDetail.Detail>
              <ul className="flex flex-col gap-2 p-2">
                {category === "Questions" && (
                  <>
                    {mcqQuizzes.map((quiz) => (
                      <li
                        key={`mcq-${quiz.id}`}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          color="cyan"
                          checked={selectedMcqQuizzes.includes(quiz.id)}
                          onChange={(e) =>
                            handleMcqQuizCheckbox(quiz.id, e.target.checked)
                          }
                        />
                        <div className="flex-1">
                          {current &&
                          current.type === "mcq" &&
                          current.id === quiz.id ? (
                            <UpdateMcqQuizForm
                              quiz={quiz}
                              lectureId={lectureId}
                              onClose={() => setCurrent(undefined)}
                            />
                          ) : (
                            <Quiz
                              type="mcq"
                              quiz={quiz}
                              printable
                              updateable={!notUpdateable(user, quiz.creatorId)}
                              onUpdate={() =>
                                setCurrent({ type: "mcq", id: quiz.id })
                              }
                            />
                          )}
                        </div>
                      </li>
                    ))}
                    {writtenQuizzes.map((quiz) => (
                      <li key={`written-${quiz.id}`}>
                        {current &&
                        current.type === "written" &&
                        current.id === quiz.id ? (
                          <UpdateWrittenQuizForm
                            quiz={quiz}
                            lectureId={lectureId}
                            onClose={() => setCurrent(undefined)}
                          />
                        ) : (
                          <Quiz
                            type="written"
                            quiz={quiz}
                            updateable={!notUpdateable(user, quiz.creatorId)}
                            onUpdate={() =>
                              setCurrent({ type: "written", id: quiz.id })
                            }
                          />
                        )}
                      </li>
                    ))}
                  </>
                )}

                {categoryLinks.map((link) => (
                  <li
                    key={`link-${link.id}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      color="cyan"
                      checked={selectedLinks.includes(link.id)}
                      onChange={(e) =>
                        handleLinkCheckbox(link.id, e.target.checked)
                      }
                    />
                    <div className="flex-1">
                      {current &&
                      current.type === "link" &&
                      current.id === link.id ? (
                        <UpdateLinkForm
                          link={link}
                          lectureId={lectureId}
                          onClose={() => setCurrent(undefined)}
                        />
                      ) : (
                        <Link
                          link={link}
                          updateable={!notUpdateable(user, link.creatorId)}
                          onUpdate={() =>
                            setCurrent({ type: "link", id: link.id })
                          }
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </SummaryDetail.Detail>
          </SummaryDetail>
        );
      })}
    </div>
  );
}
