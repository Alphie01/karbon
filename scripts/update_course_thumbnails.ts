import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const thumbnailUrl = "/images/course-thumbnail.jpg";

    console.log("Updating all courses with thumbnail:", thumbnailUrl);

    const updatedCourses = await prisma.course.updateMany({
        data: {
            thumbnail: thumbnailUrl,
        },
    });

    console.log(`Successfully updated ${updatedCourses.count} courses.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
