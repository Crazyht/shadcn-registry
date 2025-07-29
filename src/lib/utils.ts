import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 * @param inputs - Classes à combiner
 * @returns Classes combinées et optimisées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
