"use client"

import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

type FormValues = Record<string, string>

type UseFormOptions<T extends FormValues> = {
  initialValues: T
  onSubmit?: (values: T) => void | Promise<void>
}

export function useForm<T extends FormValues>({
  initialValues,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((current) => ({ ...current, [name]: value }) as T)
    },
    []
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      setValues((current) => ({ ...current, [name]: value }) as T)
    },
    []
  )

  const handleSelectChange = useCallback(
    (name: keyof T) => (value: string | null) => {
      if (value === null) return
      setValues((current) => ({ ...current, [name]: value }) as T)
    },
    []
  )

  const reset = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!onSubmit) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, values]
  )

  return {
    values,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleSelectChange,
    reset,
    handleSubmit,
  }
}
