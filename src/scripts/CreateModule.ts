/* eslint-disable no-console */
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Get module name from command line arguments
const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Error: Module name is required.");
  process.exit(1);
}

function folderName(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1) + "Service";
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Define the directory and file path
const dirPath = path.join("src", "services", folderName(moduleName));
const filePath = path.join(dirPath, "index.ts");

// Template for the module
const fileContent = `"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { T${capitalize(moduleName)} } from "@/types";

// Get all ${moduleName}s
export const getAll${capitalize(moduleName)}s = async () => {
  try {
    const res = await fetch(\`\${process.env.BASE_API}/${moduleName.toLowerCase()}s\`, {
      next: {
        tags: ["${moduleName}s"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single ${moduleName}
export const getSingle${capitalize(
  moduleName
)} = async (${moduleName.toLowerCase()}Id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(\`\${process.env.NEXT_PUBLIC_BASE_API}/${moduleName.toLowerCase()}s/\${${moduleName.toLowerCase()}Id}\`, {
      next: {
        tags: ["${moduleName}"],
      },
       headers: {
        Authorization: token,
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Create ${moduleName}
export const create${capitalize(
  moduleName
)} = async (${moduleName.toLowerCase()}Data: T${capitalize(
  moduleName
)}): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(\`\${process.env.NEXT_PUBLIC_BASE_API}/${moduleName.toLowerCase()}s\`, {
      method: "POST",
      body: JSON.stringify(${moduleName.toLowerCase()}Data),
      headers: {
      "Content-type": "application/json",
        Authorization: token,
      },
    });

    updateTag("${moduleName}s");

    return await res.json();
  } catch (error: any) {
   return error;
  }
};

// Delete ${moduleName}
export const delete${capitalize(
  moduleName
)} = async (${moduleName.toLowerCase()}Id: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(\`\${process.env.NEXT_PUBLIC_BASE_API}/${moduleName.toLowerCase()}s/\${${moduleName.toLowerCase()}Id}\`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    updateTag("${moduleName}s");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};`;

// Create directory and file
const createModule = async () => {
  try {
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, fileContent, "utf8");
    console.log(`Module ${moduleName} created successfully at ${filePath}`);
  } catch (error) {
    console.error("Error creating module:", error);
  }
};

createModule();
