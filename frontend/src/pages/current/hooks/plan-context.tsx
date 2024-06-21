import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface TaskInfo {
  taskId: number;
  task: string;
  code: string;
}

export interface PlanState {
  isLoading: boolean;
  updateIsLoading: Dispatch<SetStateAction<Boolean>>;
  plan: TaskInfo[] | undefined;
  updatePlan: Dispatch<SetStateAction<TaskInfo[]>>;
  currentTask: TaskInfo;
  updateCurrentTask: Dispatch<SetStateAction<TaskInfo>>;
  designHypothesis: string;
  updateDesignHypothesis: Dispatch<SetStateAction<string>>;
}

export const PlanContext = createContext<PlanState | undefined>(undefined);

export const usePlanContext = () => useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [plan, updatePlan] = useState(undefined);
  const [currentTask, updateCurrentTask] = useState(undefined);
  const [designHypothesis, updateDesignHypothesis] = useState(undefined);
  const [isLoading, updateIsLoading] = useState(false);

  return (
    <PlanContext.Provider
      value={{
        isLoading,
        updateIsLoading,
        plan,
        updatePlan,
        currentTask,
        updateCurrentTask,
        designHypothesis,
        updateDesignHypothesis,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};
