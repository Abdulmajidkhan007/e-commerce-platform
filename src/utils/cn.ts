type ClassValue = string | undefined | null | boolean | number | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 10)
    .filter(Boolean)
    .join(" ");
}
