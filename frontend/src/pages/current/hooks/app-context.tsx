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
}

export interface AppState {
  isLoading: boolean;
  updateIsLoading: Dispatch<SetStateAction<Boolean>>;
  plan: TaskInfo[] | undefined;
  updatePlan: Dispatch<SetStateAction<TaskInfo[]>>;
  currentTask: TaskInfo;
  updateCurrentTask: Dispatch<SetStateAction<TaskInfo>>;
  iterations: Record<number, string> | undefined;
  updateIterations: Dispatch<SetStateAction<Record<number, string>>>;
  currentIteration: number;
  updateCurrentIteration: Dispatch<SetStateAction<number>>;
  designHypothesis: string;
  updateDesignHypothesis: Dispatch<SetStateAction<string>>;
  theoriesAndParadigmsToExplore: string[];
  updateTheoriesAndParadigmsToExplore: Dispatch<SetStateAction<string[]>>;
  currentTheoryAndParadigm: string;
  updateCurrentTheoryAndParadigm: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const useAppContext = () => useContext(AppContext);

export const PlanProvider = ({ children }) => {
  const [plan, updatePlan] = useState(undefined);
  const [currentTask, updateCurrentTask] = useState(undefined);
  const [designHypothesis, updateDesignHypothesis] = useState(undefined);
  const [isLoading, updateIsLoading] = useState(false);
  const [iterations, updateIterations] = useState(undefined);
  const [currentIteration, updateCurrentIteration] = useState(0);
  const [theoriesAndParadigmsToExplore, updateTheoriesAndParadigmsToExplore] =
    useState(undefined);
  const [currentTheoryAndParadigm, updateCurrentTheoryAndParadigm] =
    useState(undefined);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        updateIsLoading,
        plan,
        updatePlan,
        currentTask,
        updateCurrentTask,
        iterations,
        updateIterations,
        currentIteration,
        updateCurrentIteration,
        designHypothesis,
        updateDesignHypothesis,
        theoriesAndParadigmsToExplore,
        updateTheoriesAndParadigmsToExplore,
        currentTheoryAndParadigm,
        updateCurrentTheoryAndParadigm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
