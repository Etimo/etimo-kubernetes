import { TerraformGenerator } from "terraform-generator";
import { Database } from "./interfaces";

export const getTerraformSafeVariableName = (s: string) =>
  s.replace(/[^a-zA-Z0-9]/, "_");

export class Terraform {
  private hasSharedDatabase = false;
  private hasDatabase = false;
  private tfg: TerraformGenerator;

  constructor() {
    this.tfg = new TerraformGenerator();
  }

  addDatabase(database: Database) {
    this.hasDatabase = !!database;
    this.hasSharedDatabase ||= database.shared;
  }

  addDatabases(databases: Database[]) {
    databases.forEach((db) => this.addDatabase(db));
  }

  write(filename: string) {}
}

class TerraformStage {}
