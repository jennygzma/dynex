import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export interface Task {
  taskId: number,
  task: string
}

export interface PlanState {
  plan: Task[] | undefined,
  updatePlan: Dispatch<SetStateAction<Task[]>>
}

export const PlanContext = createContext<PlanState | undefined>(undefined);

export const usePlanContext = ()=> useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [plan, updatePlan] = useState(undefined);

  return (
    <PlanContext.Provider value={{ plan, updatePlan }}>
      {children}
    </PlanContext.Provider>
  );
};