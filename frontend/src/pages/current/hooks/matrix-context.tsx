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

export interface MatrixState {
  matrixCategoryInfo: Record<CategoryType, string>;
  updateMatrixCategoryInfo: (category: CategoryType, newInput?: string) => void;
  submittedProblem: boolean;
  updateSubmittedProblem: Dispatch<SetStateAction<boolean>>;
  updatedMatrix: boolean;
  updateUpdatedMatrix: Dispatch<SetStateAction<boolean>>;
  currentCategory: CategoryType;
  updateCurrentCategory: Dispatch<SetStateAction<CategoryType>>;
}

export const MatrixContext = createContext<MatrixState | undefined>(undefined);

export const useMatrixContext = () => useContext(MatrixContext);

export const MatrixProvider = ({ children }) => {
  const [submittedProblem, updateSubmittedProblem] = useState(false);
  const [updatedMatrix, updateUpdatedMatrix] = useState(false);
  const [currentCategory, updateCurrentCategory] = useState<
    CategoryType | undefined
  >(undefined);

  const [matrixCategoryInfo, setUpdateMatrixCategoryInfo] = useState<
    Record<CategoryType, string>
  >({
    PersonXIdea: "",
    PersonXGrounding: "",
    ApproachXIdea: "",
    ApproachXGrounding: "",
    InteractionXIdea: "",
    InteractionXGrounding: "",
  });

  const updateMatrixCategoryInfo = (
    category: CategoryType,
    newInput?: string,
  ) => {
    setUpdateMatrixCategoryInfo((prevState) => ({
      ...prevState,
      [category]: newInput,
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
        currentCategory,
        updateCurrentCategory,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
};
