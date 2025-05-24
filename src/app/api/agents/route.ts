
export const agents =  [
    {
    id: 1,
     
      name: "Boti",
      description:
        "William Smith is a software engineer with a passion for building innovative solutions. He has experience working on a variety of projects, including web applications, mobile apps, and data analytics tools.",
        role: "Software Engineer",
    },
    {
    id: 2,
        name: "Juanchi",
        description:
          "William Smith is a software engineer with a passion for building innovative solutions. He has experience working on a variety of projects, including web applications, mobile apps, and data analytics tools.",
          role: "Software Engineer",
      }
  ]
export async function GET(request: Request) {
    return Response.json({
            result: agents
    })
}