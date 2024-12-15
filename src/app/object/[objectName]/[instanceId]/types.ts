import type {
  ObjectAttribute,
  ObjectMethod,
  MethodParameter,
  Relationship,
} from "@prisma/client";

export interface ObjectMethodWithParams extends ObjectMethod {
  parameters: MethodParameter[];
}

export interface ObjectDetails {
  id: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  version: string;
  description: string;
  attributes: ObjectAttribute[];
  methods: ObjectMethodWithParams[];
  fromRelationships: (Relationship & {
    toObject: { name: string };
  })[];
  toRelationships: (Relationship & {
    fromObject: { name: string };
  })[];
  creator: {
    id: string;
    username: string;
  };
}

export interface AttributeUpdate {
  id?: string;
  name: string;
  type: string;
  description: string;
  defaultValue?: string | null;
  required: boolean;
}

export interface MethodParameterUpdate {
  id?: string;
  name: string;
  type: string;
  defaultValue?: string | null;
  isOptional: boolean;
}

export interface MethodUpdate {
  id?: string;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "PROTECTED";
  returnType: string | null;
  parameters: MethodParameterUpdate[];
}
