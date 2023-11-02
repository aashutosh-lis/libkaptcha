import React from "react";

export interface KaptchaCardProps {
  title: string;
}
export function KaptchaCard({ title }: KaptchaCardProps) {
  return (
    <article>
      <h1>{title}</h1>
    </article>
  );
}
