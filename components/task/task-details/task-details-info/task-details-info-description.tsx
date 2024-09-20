import { Editor } from "@/components/text-editor/editor";
import { type SerializedEditorState } from "lexical";
import { EditorPreview } from "@/components/text-editor/preview";
import { Fragment, useState } from "react";
import { type TaskType } from "@/utils/types";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const Description: React.FC<{ task: TaskType }> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const [content, setContent] = useState<SerializedEditorState | undefined>(
    (task.description
      ? JSON.parse(task.description)
      : undefined) as SerializedEditorState
  );

  function handleEdit(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    setIsEditing(true);
  }

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setContent(state);
    updateTask({
      taskId: task.id,
      description: state ? JSON.stringify(state) : undefined,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <Fragment>
      <h2>Mô tả công việc</h2>
      <div>
        {isEditing ? (
          <Editor
            action="description"
            content={content}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div onMouseDown={handleEdit}>
            <EditorPreview
              action="description"
              content={content}
              className="transition-all duration-200 hover:bg-gray-100"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export { Description };
