import * as yup from "yup";

export async function validateSchema<T>(schema: yup.Schema<T>, data: T): Promise<T> {
    try {
      return await schema.validate(data, { abortEarly: false }); // AbortEarly ensures all errors are captured
    } catch (error: any) {
      throw new Error(
        error.inner
          .map((err: any) => err.message)
          .join(", ")
      ); // Aggregate error messages
    }
  }