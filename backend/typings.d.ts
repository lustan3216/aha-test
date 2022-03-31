import { ClassConstructor, ClassTransformOptions } from 'class-transformer/types/interfaces';

declare module 'class-transformer' {
  export function plainToClass<T, V>(cls: ClassConstructor<T>, plain: V[], options?: ClassTransformOptions): T[];
  export function plainToClass<T, V>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T;
}
