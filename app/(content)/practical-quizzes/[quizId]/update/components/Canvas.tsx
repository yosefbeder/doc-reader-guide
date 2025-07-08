"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const MIN_WIDTH = 20;
const MIN_HEIGHT = 20;

type RectType = "mask" | "tape";

interface Rect {
  id?: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Selection {
  type: RectType;
  index: number;
  init: Rect;
  dx?: number;
  dy?: number;
}

export interface State {
  masks: Rect[];
  tapes: Rect[];
}

interface CanvasProps {
  formId: string;
  init?: {
    id: number;
    state?: State;
    imageUrl?: string;
  };
}

export default function Canvas({ formId, init }: CanvasProps) {
  const [reactState, setReactState] = useState<State>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageSrc = init
    ? init.imageUrl
    : imageFile && URL.createObjectURL(imageFile);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typeSelectRef = useRef<HTMLSelectElement>(null);
  const undoButtonRef = useRef<HTMLButtonElement>(null);
  const redoButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const zoomInButtonRef = useRef<HTMLButtonElement>(null);
  const zoomOutButtonRef = useRef<HTMLButtonElement>(null);
  const isTouchDevice = navigator.maxTouchPoints;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (!imageSrc) return;
    let factor: number;
    const canvas = canvasRef.current!;
    let createType: RectType = "tape";
    const undoStack: State[] = [];
    const redoStack: State[] = [];
    let state: State = (init && init.state) || { masks: [], tapes: [] };
    setReactState(JSON.parse(JSON.stringify(state)));
    let selection: Selection | null = null;
    const c = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;
    let isCreating = false;
    let isEditing = false;
    let scale = 1;
    let startDistance: number;
    let startMidpointX = 0;
    let startMidpointY = 0;
    let translateX = 0;
    let translateY = 0;

    image.onload = () => {
      updateTransform();
    };

    function addRect(type: RectType, rect: Rect) {
      if (type === "tape") {
        setReactState(
          (prev) =>
            prev && {
              masks: [...prev.masks],
              tapes: [...prev.tapes, rect],
            }
        );
        state.tapes.push(rect);
      } else {
        setReactState(
          (prev) =>
            prev && {
              masks: [...prev.masks, rect],
              tapes: [...prev.tapes],
            }
        );
        state.masks.push(rect);
      }
    }

    function deleteRect(type: RectType, index: number) {
      if (type === "tape") {
        setReactState(
          (prev) =>
            prev && {
              masks: prev.masks,
              tapes: prev.tapes.filter((_, tapeIndex) => tapeIndex !== index),
            }
        );
        state.tapes.splice(index, 1);
      } else {
        setReactState(
          (prev) =>
            prev && {
              masks: prev.masks.filter((_, maskIndex) => maskIndex !== index),
              tapes: prev.tapes,
            }
        );
        state.masks.splice(index, 1);
      }
    }

    function updateRect(type: RectType, index: number) {
      if (type === "tape")
        setReactState(
          (prev) =>
            prev && {
              masks: prev.masks,
              tapes: [
                ...prev.tapes.slice(0, index),
                { ...state.tapes[index] },
                ...prev.tapes.slice(index + 1),
              ],
            }
        );
      else
        setReactState(
          (prev) =>
            prev && {
              masks: [
                ...prev.masks.slice(0, index),
                { ...state.masks[index] },
                ...prev.masks.slice(index + 1),
              ],
              tapes: prev.tapes,
            }
        );
    }

    function getDistance(touch1: Touch, touch2: Touch) {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function isEventInside(e: MouseEvent | TouchEvent, rect: Rect) {
      const { x, y } = getEPos(e);

      if (
        x > rect.x &&
        x < rect.x + rect.w &&
        y > rect.y &&
        y < rect.y + rect.h
      )
        return true;
      return false;
    }

    function normalize(type: RectType, index: number) {
      const rect = type === "mask" ? state.masks[index] : state.tapes[index];
      if (rect.w < 0) {
        rect.x += rect.w;
        rect.w = -rect.w;
        updateRect(type, index);
      }
      if (rect.h < 0) {
        rect.y += rect.h;
        rect.h = -rect.h;
        updateRect(type, index);
      }
    }

    function getEPos(e: MouseEvent | TouchEvent) {
      const canvasRect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = (clientX - canvasRect.left) / factor;
      const y = (clientY - canvasRect.top) / factor;
      return { x, y };
    }

    function getMidpoint(touch1: Touch, touch2: Touch) {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    }

    function updateTransform() {
      if (!c) return;
      canvas.width =
        scale *
        (window.innerWidth < image.width ? window.innerWidth : image.width);
      factor = canvas.width / image.width;
      canvas.height = image.height * factor;
      if (isTouchDevice)
        canvas.style.transform = `translate(${translateX}px, ${translateY}px)`;
      c.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    function storeState() {
      redoStack.splice(0, redoStack.length);
      undoStack.push(JSON.parse(JSON.stringify(state)));
    }

    function handleZoomIn() {
      scale += 0.1;
      updateTransform();
    }

    function handleZoomOut() {
      scale -= 0.1;
      updateTransform();
    }

    function handleUndo() {
      if (undoStack.length > 0) {
        redoStack.push(state);
        setReactState(undoStack.pop()!);
        selection = null;
      }
    }

    function handleRedo() {
      if (redoStack.length > 0) {
        undoStack.push(state);
        setReactState(redoStack.pop()!);
        selection = null;
      }
    }

    function handleDelete() {
      if (!selection) return;
      storeState();
      deleteRect(selection.type, selection.index);
    }

    function handleTypeChange(e: Event) {
      createType = (e!.target as any).value as RectType;
    }

    function handleResize() {
      updateTransform();
    }

    function handleClick(e: MouseEvent | TouchEvent) {
      let clickSelection: Selection | null = null;
      for (let i = state.masks.length - 1; i >= 0; i--) {
        const mask = state.masks[i];
        if (isEventInside(e, mask)) {
          clickSelection = {
            type: "mask",
            index: i,
            init: { ...state.masks[i] },
          };
          break;
        }
      }
      if (!clickSelection)
        for (let i = state.tapes.length - 1; i >= 0; i--) {
          const tape = state.tapes[i];
          if (isEventInside(e, tape)) {
            clickSelection = {
              type: "tape",
              index: i,
              init: { ...state.tapes[i] },
            };
            break;
          }
        }
      if (clickSelection) selection = clickSelection;
    }

    function handleStart(e: MouseEvent | TouchEvent) {
      if (e instanceof TouchEvent && e.touches.length === 2) return;
      storeState();
      const { x, y } = getEPos(e);
      const selectedRect =
        selection &&
        (selection.type === "tape"
          ? state.tapes[selection.index]
          : state.masks[selection.index]);
      if (selectedRect && isEventInside(e, selectedRect)) {
        selection!.dy = y - selectedRect.y;
        selection!.dx = x - selectedRect.x;
        isEditing = true;
      } else {
        isCreating = true;
        selection = null;
        const rect = {
          x: x,
          y: y,
          w: 0,
          h: 0,
        };
        addRect(createType, rect);
      }
    }

    function handleMove(e: MouseEvent | TouchEvent) {
      if (e instanceof TouchEvent && e.touches.length === 2) return;
      const { x, y } = getEPos(e);
      const selectedRect =
        selection &&
        (selection.type === "tape"
          ? state.tapes[selection.index]
          : state.masks[selection.index]);
      if (isEditing) {
        let isResizing = false;
        if (selection!.dx! < 20) {
          isResizing = true;
          selectedRect!.x = x - selection!.dx!;
          selectedRect!.w =
            selection!.init.w - (x - selection!.init.x) + selection!.dx!;
        } else if (selection!.dx! > selection!.init.w - 20) {
          isResizing = true;
          selectedRect!.w = x - selectedRect!.x;
        }
        if (selection!.dy! < 20) {
          isResizing = true;
          selectedRect!.y = y - selection!.dy!;
          selectedRect!.h =
            selection!.init.h - (y - selection!.init.y) + selection!.dy!;
        } else if (selection!.dy! > selection!.init.h - 20) {
          isResizing = true;
          selectedRect!.h = y - selectedRect!.y;
        }
        if (!isResizing) {
          selectedRect!.x = x - selection!.dx!;
          selectedRect!.y = y - selection!.dy!;
          canvas.style.cursor = "grabbing";
        }
      } else if (isCreating) {
        const rect =
          createType === "tape"
            ? state.tapes[state.tapes.length - 1]
            : state.masks[state.masks.length - 1];
        rect.w = x - rect.x;
        rect.h = y - rect.y;
      } else if (selectedRect) {
        let cursor;
        if (!isEventInside(e, selectedRect)) {
          cursor = "auto";
        } else {
          selection!.dx = x - selectedRect.x;
          selection!.dy = y - selectedRect.y;
          const minX = selection!.dx < 20;
          const maxX = selection!.dx > selection!.init.w - 20;
          const minY = selection!.dy < 20;
          const maxY = selection!.dy > selection!.init.h - 20;
          if (minX) {
            if (minY) {
              cursor = "nw-resize";
            } else if (maxY) {
              cursor = "sw-resize";
            } else {
              cursor = "w-resize";
            }
          } else if (maxX) {
            if (minY) {
              cursor = "ne-resize";
            } else if (maxY) {
              cursor = "se-resize";
            } else {
              cursor = "e-resize";
            }
          } else if (minY) cursor = "n-resize";
          else if (maxY) cursor = "s-resize";
          else {
            cursor = "grab";
          }
        }
        canvas.style.cursor = cursor;
      }
    }

    function handleEnd() {
      let rectIndex;
      let rect;
      let rectType: RectType;
      if (isEditing) {
        rectIndex = selection!.index;
        rectType = selection!.type;
        rect =
          rectType === "tape" ? state.tapes[rectIndex] : state.masks[rectIndex];
        isEditing = false;
      }
      if (isCreating) {
        rectType = createType;
        rectIndex =
          rectType === "tape" ? state.tapes.length - 1 : state.masks.length - 1;
        rect =
          rectType === "tape" ? state.tapes[rectIndex] : state.masks[rectIndex];
        isCreating = false;
      }
      if (rect && rectType! && rectIndex!) {
        state.tapes.forEach((_, index) => normalize("tape", index));
        state.masks.forEach((_, index) => normalize("mask", index));
        if (selection) selection.init = { ...rect };
        else
          selection = { type: rectType, index: rectIndex, init: { ...rect } };
        if (rect.w < MIN_WIDTH || rect.h < MIN_HEIGHT) {
          deleteRect(rectType, rectIndex);
          selection = null;
          canvas.style.cursor = "auto";
        }
      }
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        startDistance = getDistance(e.touches[0], e.touches[1]);
        const midpoint = getMidpoint(e.touches[0], e.touches[1]);
        startMidpointX = midpoint.x - translateX;
        startMidpointY = midpoint.y - translateY;
      } else if (e.touches.length === 1) {
        e.preventDefault();
        if (!selection) handleClick(e);
        handleStart(e);
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const newScale = scale * (currentDistance / startDistance);
        scale = Math.max(0.5, Math.min(4, newScale));
        startDistance = currentDistance;
        const midpoint = getMidpoint(e.touches[0], e.touches[1]);
        translateX = midpoint.x - startMidpointX;
        translateY = midpoint.y - startMidpointY;
        updateTransform();
      } else if (e.touches.length === 1) {
        e.preventDefault();
        handleMove(e);
      }
    }

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseout", handleEnd);
    if (isTouchDevice) {
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove);
      canvas.addEventListener("touchend", handleEnd);
      canvas.addEventListener("touchcancel", handleEnd);
    }
    typeSelectRef.current!.addEventListener("change", handleTypeChange);
    deleteButtonRef.current!.addEventListener("click", handleDelete);
    undoButtonRef.current!.addEventListener("click", handleUndo);
    redoButtonRef.current!.addEventListener("click", handleRedo);
    zoomInButtonRef.current!.addEventListener("click", handleZoomIn);
    zoomOutButtonRef.current!.addEventListener("click", handleZoomOut);

    function animate() {
      requestAnimationFrame(animate);
      if (!c) return;
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (let i = 0; i < state.tapes.length; i++) {
        const tape = state.tapes[i];
        c.fillStyle = "#fef08a";
        c.lineWidth = 2;
        c.strokeStyle = "black";
        c.fillRect(
          tape.x * factor,
          tape.y * factor,
          tape.w * factor,
          tape.h * factor
        );
        c.strokeRect(
          tape.x * factor,
          tape.y * factor,
          tape.w * factor,
          tape.h * factor
        );
        if (selection && selection.type === "tape" && selection.index === i) {
          c.lineWidth = 4;
          c.strokeStyle = "#60a5fa";
          c.strokeRect(
            (tape.x - 10) * factor,
            (tape.y - 10) * factor,
            (tape.w + 10 * 2) * factor,
            (tape.h + 10 * 2) * factor
          );
        }
      }
      for (let i = 0; i < state.masks.length; i++) {
        const mask = state.masks[i];
        c.fillStyle = "white";
        c.lineWidth = 2;
        c.strokeStyle = "black";
        c.fillRect(
          mask.x * factor,
          mask.y * factor,
          mask.w * factor,
          mask.h * factor
        );
        c.strokeRect(
          mask.x * factor,
          mask.y * factor,
          mask.w * factor,
          mask.h * factor
        );
        if (selection && selection.type === "mask" && selection.index === i) {
          c.lineWidth = 4;
          c.strokeStyle = "#60a5fa";
          c.strokeRect(
            (mask.x - 10) * factor,
            (mask.y - 10) * factor,
            (mask.w + 10 * 2) * factor,
            (mask.h + 10 * 2) * factor
          );
        }
      }
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseout", handleEnd);
      if (isTouchDevice) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleEnd);
        canvas.removeEventListener("touchcancel", handleEnd);
      }
      typeSelectRef.current?.removeEventListener("change", handleTypeChange);
      deleteButtonRef.current?.removeEventListener("click", handleDelete);
      undoButtonRef.current?.removeEventListener("click", handleUndo);
      redoButtonRef.current?.removeEventListener("click", handleRedo);
      zoomInButtonRef.current?.removeEventListener("click", handleZoomIn);
      zoomOutButtonRef.current?.removeEventListener("click", handleZoomOut);
      if (c) c.reset();
    };
  }, [imageFile]);

  return (
    <>
      <input
        required={init ? false : true}
        type="file"
        accept="image/*"
        name="image"
        id="image"
        className={init && "hidden"}
        onChange={handleImageChange}
        form={formId}
      />
      <input
        type="text"
        id={`practical-question-${init ? init.id : "new"}-masks`}
        name="masks"
        className="hidden"
        defaultValue={JSON.stringify(reactState?.masks)}
        form={formId}
      />
      <input
        type="text"
        id={`practical-question-${init ? init.id : "new"}-tapes`}
        name="tapes"
        className="hidden"
        defaultValue={JSON.stringify(reactState?.tapes)}
        form={formId}
      />
      <div className="flex gap-2 *:px-2 *:py-1 *:border">
        <select name="type" ref={typeSelectRef} defaultValue="tape">
          <option value="tape">Tape</option>
          <option value="mask">Mask</option>
        </select>
        <button ref={undoButtonRef}>Undo</button>
        <button ref={redoButtonRef}>Redo</button>
        <button ref={deleteButtonRef}>Delete</button>
        <button ref={zoomInButtonRef}>+</button>
        <button ref={zoomOutButtonRef}>-</button>
      </div>
      <div
        style={{
          overflow: isTouchDevice ? "hidden" : "scroll",
        }}
        className="h-96 border"
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
}
