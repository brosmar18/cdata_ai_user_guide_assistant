import { userThread } from "@prisma/client";
import { atom } from "jotai";

export const userThreadAtom = atom<userThread | null>(null);