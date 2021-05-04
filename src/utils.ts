import { DiagnosticResponseItem } from "onstarjs/dist/types";

export function pause(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getDiagnosticItem(
  name: string,
  diagnosticResponse: DiagnosticResponseItem[],
):
  | {
      name: string;
      status: string;
      message: string;
      value?: string;
      unit?: string;
    }
  | undefined {
  const diagnosticResponseItem = diagnosticResponse.find(
    (diagnosticItem) => diagnosticItem.name === name,
  );

  return diagnosticResponseItem?.diagnosticElement.find(
    (elementItem) => elementItem.name === name,
  );
}
