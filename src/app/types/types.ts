export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole.ADMIN | UserRole.EDITOR | UserRole.VIEWER; // Permissions for user actions
  createdAt: Date;
  designs?: Object[]; // Objects created or managed by the user
}

export interface Object {
  id: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  attributes?: ObjectAttribute[];
  methods?: ObjectMethod[];
  tags?: Tag[]; // Organizational tags for better search and filtering
  categories?: string[]; // Categories for grouping objects
}

export enum RelationshipType { // Types of relationships between objects
  COMPOSITION = "composition",
  INHERITANCE = "inheritance",
  ASSOCIATION = "association",
}

export interface Relationship {
  id: string;
  fromObjectId: string; // Parent object ID
  toObjectId: string; // Child object ID
  type:
    | RelationshipType.COMPOSITION
    | RelationshipType.INHERITANCE
    | RelationshipType.ASSOCIATION;
  description?: string;
}

export interface ObjectAttribute {
  id: string;
  objectId: string;
  name: string;
  type: string;
  description: string;
  defaultValue?: string; // Optional initial value
  required?: boolean; // Indicates if this attribute is mandatory
}

export enum Visibility { // Access control levels for methods
  PUBLIC = "public",
  PRIVATE = "private",
  PROTECTED = "protected",
}

export interface ObjectMethod {
  id: string;
  objectId: string;
  name: string;
  description: string;
  visibility: Visibility.PUBLIC | Visibility.PRIVATE | Visibility.PROTECTED; // Access control
  returnType?: string; // The return type of the method
  parameters?: MethodParameter[]; // Parameters of the method
}

export interface MethodParameter {
  id: string;
  methodId: string;
  name: string;
  type: string;
  defaultValue?: string; // Optional default value for parameters
  isOptional?: boolean; // Indicates if the parameter is required
}

export interface Tag {
  id: string;
  name: string; // Tag name
  description?: string; // Optional description for the tag
}

export interface History {
  id: string;
  objectId: string; // The object associated with this history entry
  userId: string; // User who made the change
  timestamp: Date; // Time of the change
  changes: string; // Summary or details of the change
}

export interface Diagram {
  id: string;
  creatorId: string; // User who created the diagram
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string; // Optional description of the diagram
  elements: DiagramElement[]; // Elements within the diagram
}

export enum DiagramElementType { // Types of elements in a diagram
  CLASS = "class",
  INTERFACE = "interface",
  RELATIONSHIP = "relationship",
}

export interface DiagramElement {
  id: string;
  diagramId: string; // Diagram this element belongs to
  objectId?: string; // Optional reference to an existing object
  type:
    | DiagramElementType.CLASS
    | DiagramElementType.INTERFACE
    | DiagramElementType.RELATIONSHIP;
  position: { x: number; y: number }; // For positioning in the diagram
}

export interface Comment {
  id: string;
  objectId?: string; // Optional reference to an object
  diagramId?: string; // Optional reference to a diagram
  userId: string; // User who made the comment
  content: string; // Comment text
  createdAt: Date; // Time the comment was created
}
