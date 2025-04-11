'use client'

import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";

type FormValues = {
  username: string;
  password: {
    pass: string
  }
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  },
  phoneNumbers: {
    id: string;
    value: string;
  }[];
  age: number;
}

export default function Home() {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: {
        pass: ""
      },
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: [{ id: "", value: "" }],
      age: 0
    }
  });

  const { register, control, handleSubmit, setValue, formState, watch, reset } = form;
  const { errors, isValid, isSubmitting } = formState;
  const watchedAge = watch(["age", "channel"]);

  const { fields, append, remove } = useFieldArray({
    name: "phoneNumbers",
    control,
  })

  useEffect(() => {
    const subscription = watch((name) => {
      console.log(name);
    });

    return () => subscription.unsubscribe();
  }, [watchedAge])

  const onSubmit = (data: FormValues) => {
    console.log(data);
  }

  return (
    <div className="mt-[10vh]" onSubmit={handleSubmit(onSubmit)}>
      <form className="flex flex-col gap-2 w-1/3 mx-auto" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex w-full justify-between gap-2">
          <label htmlFor="username">Username</label>
          <input {...register("username", {
            required: "Username is required",
            validate: {
              notAdmin: (value) => {
                return (value !== "admin") || "Username cannot be admin";
              },
              maxLength: (value) => value.length <= 12 || "Username must be less than 3 characters"
            },
            disabled: true
          })} className="border border-gray-300 rounded p-2" placeholder="Enter your username" type="text" id="username" name="username" />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </div>

        <div className="flex w-full justify-between gap-2">
          <label htmlFor="password.pass">Password</label>
          <input {...register("password.pass", {
            pattern: {
              value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/,
              message: "Password must contain at least one number, one lowercase and one uppercase letter"
            },
            required: "Password is required",
          })} className="border border-gray-300 rounded p-2" placeholder="Enter your password" type="password" id="password" />
        </div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <div className="flex w-full justify-between gap-2">
          <label htmlFor="channel">Channel</label>
          <input {...register("channel", { required: "Channel is required" })} className="border border-gray-300 rounded p-2" placeholder="Enter your channel" type="text" id="channel" />
        </div>
        {errors.channel && <p className="text-red-500">{errors.channel.message}</p>}

        <div>
          <button type="button" onClick={() => append({ id: Date.now().toString(), value: "" })}>Add Phone</button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumbers">Phone Numbers</label>
          <button type="button" onClick={() => append({ id: Date.now().toString(), value: "" })}>Add</button>
          {
            fields.map((field, index) => (
              <div key={field.id}>
                <input key={field.id} {...register(`phoneNumbers.${index}.value`, { required: "Phone numbers are required", pattern: { value: /^\d{10}$/, message: "Phone number must be 10 digits" } })} className="border border-gray-300 rounded p-2" placeholder="Enter your phone numbers" type="text" />
                <button type="button" onClick={() => remove(index)}>Remove</button>
              </div>
            ))
          }
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input {...register("age", { required: "Age is required", valueAsNumber: true })} className="border border-gray-300 rounded p-2" placeholder="Enter your age" type="number" id="age" name="age" />
        </div>
        <div>
          <button type="button" onClick={() => {
            if (watch("username") === "romit") {
              setValue("username", "admin");
            } else {
              setValue("username", "romit", { shouldValidate: true, shouldTouch: true, shouldDirty: true });
            }
          }}>toggle username</button>
        </div>

        <button disabled={!isValid || !isSubmitting} type="submit" className="bg-black text-white border-blue-  p-2 rounded w-1/4">Submit</button>
        <button className="bg-black text-white border-blue-  p-2 rounded w-1/4" type="button" onClick={() => reset()}>Reset</button>
      </form>
      <DevTool control={control} />
      <div className="mx-auto w-1/3 text-2xl mt-4"> Your age is {watchedAge}</div>
    </div>
  );
}
