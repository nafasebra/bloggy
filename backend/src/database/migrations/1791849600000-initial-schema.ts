import { MigrationInterface, QueryRunner } from 'typeorm';
export class InitialSchema1791849600000 implements MigrationInterface {
  name = 'InitialSchema1791849600000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"users_role_enum\" AS ENUM('admin', 'user')"
    );
    await queryRunner.query(
      'CREATE TABLE "users" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "bio" text, "avatar" text, "location" text, "website" text, "twitter" text, "followers" integer DEFAULT \'0\', "following" integer DEFAULT \'0\', "category" text, "isNew" boolean NOT NULL DEFAULT true, "role" "users_role_enum" NOT NULL DEFAULT \'user\', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_46c438e5a956fb9c3e86e73e321" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE TABLE "posts" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" text NOT NULL, "content" text NOT NULL, "excerpt" text NOT NULL, "tags" text array NOT NULL DEFAULT \'{}\', "category" text NOT NULL, "authorId" uuid NOT NULL, "authorName" text NOT NULL, "views" integer DEFAULT \'0\', "likes" integer DEFAULT \'0\', CONSTRAINT "PK_399179b79c5b2030e8c0022bf48" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") '
    );
    await queryRunner.query(
      'CREATE TABLE "post_views" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "postId" uuid NOT NULL, "ipAddress" text NOT NULL, "viewedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7f6150ccde765152fdb69708549" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_e519adac11ed16faacf925e822" ON "post_views" ("postId", "ipAddress") '
    );
    await queryRunner.query(
      'CREATE TABLE "post_likes" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "postId" uuid NOT NULL, "ipAddress" text NOT NULL, "userId" uuid, "likesAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_057ef406667df63f53584df57ab" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_2d24c883f8dd75b0b0fae4bde1" ON "post_likes" ("postId", "userId") WHERE "userId" IS NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_6e3a39caa243e9300ef4e2b335" ON "post_likes" ("postId", "ipAddress") '
    );
    await queryRunner.query(
      'CREATE TABLE "comments" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" text NOT NULL, "postId" uuid NOT NULL, "authorId" uuid NOT NULL, "authorName" text NOT NULL, "likes" integer DEFAULT \'0\', "parentId" uuid, CONSTRAINT "PK_09028bba28e1e189969ab502fea" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_e44ddaaa6d058cb4092f83ad61" ON "comments" ("postId") '
    );
    await queryRunner.query(
      'CREATE TABLE "comment_likes" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "commentId" uuid NOT NULL, "ipAddress" text NOT NULL, "likesAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dc7d2e757425425ffb83b16c215" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_66a2fca771a875a0f52adea78e" ON "comment_likes" ("commentId", "ipAddress") '
    );
    await queryRunner.query(
      'CREATE TABLE "follows" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "followerId" uuid NOT NULL, "followingId" uuid NOT NULL, CONSTRAINT "PK_4361d00038c9c67d8a7ac6b5f94" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_105079775692df1f8799ed0fac" ON "follows" ("followerId", "followingId") '
    );
    await queryRunner.query(
      "CREATE TYPE \"notifications_type_enum\" AS ENUM('follow', 'like', 'comment')"
    );
    await queryRunner.query(
      'CREATE TABLE "notifications" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "type" "notifications_type_enum" NOT NULL, "relatedUserId" uuid NOT NULL, "relatedPostId" uuid, "relatedCommentId" uuid, "read" boolean NOT NULL DEFAULT false, "message" text NOT NULL, "link" text, CONSTRAINT "PK_9b4dc235e7adc8bca874331977e" PRIMARY KEY ("_id"))'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_21e65af2f4f242d4c85a92aff4" ON "notifications" ("userId", "createdAt") '
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_d60c47e715847c8aa792ba6d1e" ON "notifications" ("userId", "read") '
    );
    await queryRunner.query(
      'ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "post_views" ADD CONSTRAINT "FK_a05ca4e99f3345db11cfe91ee6e" FOREIGN KEY ("postId") REFERENCES "posts"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "post_likes" ADD CONSTRAINT "FK_6999d13aca25e33515210abaf16" FOREIGN KEY ("postId") REFERENCES "posts"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "post_likes" ADD CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" ADD CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81" FOREIGN KEY ("parentId") REFERENCES "comments"("_id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4" FOREIGN KEY ("commentId") REFERENCES "comments"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" ADD CONSTRAINT "FK_14e810558a4aa10b9867a9b0182" FOREIGN KEY ("relatedUserId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" ADD CONSTRAINT "FK_bedc32aa935d88df22bb224e12f" FOREIGN KEY ("relatedPostId") REFERENCES "posts"("_id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" ADD CONSTRAINT "FK_6120a0d05c0983810a0bcf05be9" FOREIGN KEY ("relatedCommentId") REFERENCES "comments"("_id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "notifications" DROP CONSTRAINT "FK_6120a0d05c0983810a0bcf05be9"'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" DROP CONSTRAINT "FK_bedc32aa935d88df22bb224e12f"'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" DROP CONSTRAINT "FK_14e810558a4aa10b9867a9b0182"'
    );
    await queryRunner.query(
      'ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"'
    );
    await queryRunner.query(
      'ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"'
    );
    await queryRunner.query(
      'ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"'
    );
    await queryRunner.query(
      'ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4"'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" DROP CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81"'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"'
    );
    await queryRunner.query(
      'ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"'
    );
    await queryRunner.query(
      'ALTER TABLE "post_likes" DROP CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498"'
    );
    await queryRunner.query(
      'ALTER TABLE "post_likes" DROP CONSTRAINT "FK_6999d13aca25e33515210abaf16"'
    );
    await queryRunner.query(
      'ALTER TABLE "post_views" DROP CONSTRAINT "FK_a05ca4e99f3345db11cfe91ee6e"'
    );
    await queryRunner.query(
      'ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"'
    );
    await queryRunner.query('DROP INDEX "IDX_d60c47e715847c8aa792ba6d1e"');
    await queryRunner.query('DROP INDEX "IDX_21e65af2f4f242d4c85a92aff4"');
    await queryRunner.query('DROP TABLE "notifications"');
    await queryRunner.query('DROP TYPE "notifications_type_enum"');
    await queryRunner.query('DROP INDEX "IDX_105079775692df1f8799ed0fac"');
    await queryRunner.query('DROP TABLE "follows"');
    await queryRunner.query('DROP INDEX "IDX_66a2fca771a875a0f52adea78e"');
    await queryRunner.query('DROP TABLE "comment_likes"');
    await queryRunner.query('DROP INDEX "IDX_e44ddaaa6d058cb4092f83ad61"');
    await queryRunner.query('DROP TABLE "comments"');
    await queryRunner.query('DROP INDEX "IDX_6e3a39caa243e9300ef4e2b335"');
    await queryRunner.query('DROP INDEX "IDX_2d24c883f8dd75b0b0fae4bde1"');
    await queryRunner.query('DROP TABLE "post_likes"');
    await queryRunner.query('DROP INDEX "IDX_e519adac11ed16faacf925e822"');
    await queryRunner.query('DROP TABLE "post_views"');
    await queryRunner.query('DROP INDEX "IDX_c5a322ad12a7bf95460c958e80"');
    await queryRunner.query('DROP TABLE "posts"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "users_role_enum"');
  }
}
