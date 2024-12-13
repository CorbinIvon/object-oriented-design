import type {
  ObjectAttribute,
  ObjectMethod,
  Relationship,
} from "@prisma/client";

export interface ObjectDetails {
  id: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  version: string;
  description: string;
  attributes: ObjectAttribute[];
  methods: ObjectMethod[];
  fromRelationships: (Relationship & {
    toObject: { name: string };
  })[];
  toRelationships: (Relationship & {
    fromObject: { name: string };
  })[];
  creator: {
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
