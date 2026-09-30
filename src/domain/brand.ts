declare const brand: unique symbol;

/** Nominal type over a primitive, so a `Minor` can never be passed where a `Milli` is expected. */
export type Brand<Base, Name extends string> = Base & { readonly [brand]: Name };
