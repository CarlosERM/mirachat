"use client";

export default function ConnectionState({
  isConnected,
}: {
  isConnected: boolean;
}) {
  return <p>State: {"" + isConnected}</p>;
}
