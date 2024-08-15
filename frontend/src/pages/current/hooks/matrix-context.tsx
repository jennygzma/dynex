import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type CategoryType =
  | "PersonXIdea"
  | "PersonXGrounding"
  | "ApproachXIdea"
  | "ApproachXGrounding"
  | "InteractionXIdea"
  | "InteractionXGrounding";

interface MatrixCategory {
  input: string;
  needsSpecification: false;
}

export interface MatrixState {
  matrixCategoryInfo: Record<CategoryType, MatrixCategory>;
  updateMatrixCategoryInfo: (
    category: CategoryType,
    newNeedsSpecification?: boolean,
    newInput?: string,
  ) => void;
  submittedProblem: boolean;
  updateSubmittedProblem: Dispatch<SetStateAction<boolean>>;
  updatedMatrix: boolean;
  updateUpdatedMatrix: Dispatch<SetStateAction<boolean>>;
}

export const MatrixContext = createContext<MatrixState | undefined>(undefined);

export const useMatrixContext = () => useContext(MatrixContext);

export const MatrixProvider = ({ children }) => {
  const [submittedProblem, updateSubmittedProblem] = useState(false);
  const [updatedMatrix, updateUpdatedMatrix] = useState(false);

  const [matrixCategoryInfo, setUpdateMatrixCategoryInfo] = useState<
    Record<CategoryType, MatrixCategory>
  >({
    PersonXIdea: {
      input: "",
      needsSpecification: false,
    },
    PersonXGrounding: {
      input: "",
      needsSpecification: false,
    },
    ApproachXIdea: {
      input: "",
      needsSpecification: false,
    },
    ApproachXGrounding: {
      input: "",
      needsSpecification: false,
    },
    InteractionXIdea: {
      input: "",
      needsSpecification: false,
    },
    InteractionXGrounding: {
      input: "",
      needsSpecification: false,
    },
  });

  const updateMatrixCategoryInfo = (
    category: CategoryType,
    newNeedsSpecification?: boolean,
    newInput?: string,
  ) => {
    setUpdateMatrixCategoryInfo((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        input: newInput ? newInput : prevState[category].input,
        needsSpecification: newNeedsSpecification
          ? newNeedsSpecification
          : prevState[category].input,
      },
    }));
  };

  return (
    <MatrixContext.Provider
      value={{
        matrixCategoryInfo,
        updateMatrixCategoryInfo,
        submittedProblem,
        updateSubmittedProblem,
        updatedMatrix,
        updateUpdatedMatrix,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
};
