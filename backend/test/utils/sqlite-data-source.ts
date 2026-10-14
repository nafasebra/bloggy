import { DataSource, EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { databaseOptions } from '../../src/database/database.config';

class EntityMetadataSource extends DataSource {
  async describeEntities() {
    await this.buildMetadatas();
    return this.entityMetadatas;
  }
}

/** SQLite test schemas use the same entity classes, relations, and indexes. */
export async function createSqliteDataSource(): Promise<DataSource> {
  const metadata = await new EntityMetadataSource(
    databaseOptions('postgresql://unused/unused')
  ).describeEntities();
  const entities = metadata.map(entity => {
    const columns: Record<string, EntitySchemaColumnOptions> = {};
    for (const column of entity.columns) {
      const type = column.isArray
        ? 'simple-json'
        : column.type === 'enum'
          ? 'simple-enum'
          : column.type === 'timestamptz'
            ? 'datetime'
            : column.type === 'uuid'
              ? 'varchar'
              : column.type;
      columns[column.propertyName] = {
        type,
        primary: column.isPrimary,
        generated: column.isGenerated ? column.generationStrategy : undefined,
        nullable: column.isNullable,
        select: column.isSelect,
        createDate: column.isCreateDate,
        updateDate: column.isUpdateDate,
        enum: column.enum,
        default: column.isArray
          ? '[]'
          : column.type === 'timestamptz'
            ? () => 'CURRENT_TIMESTAMP'
            : column.default,
      };
    }
    return new EntitySchema({
      name: entity.name,
      target: entity.target as new () => object,
      tableName: entity.tableName,
      columns,
      relations: Object.fromEntries(
        entity.relations.map(relation => [
          relation.propertyName,
          {
            type: relation.relationType,
            target: relation.inverseEntityMetadata.name,
            nullable: relation.isNullable,
            onDelete: relation.onDelete,
            joinColumn: relation.joinColumns.map(column => ({
              name: column.databaseName,
              referencedColumnName: column.referencedColumn!.propertyName,
            })),
          },
        ])
      ),
      indices: entity.indices.map(index => ({
        name: index.name,
        columns: index.columns.map(column => column.propertyName),
        unique: index.isUnique,
        where: index.where,
      })),
      uniques: entity.uniques.map(unique => ({
        name: unique.name,
        columns: unique.columns.map(column => column.propertyName),
      })),
    });
  });
  // sql.js runs actual SQLite in memory without native binaries or Docker.
  return new DataSource({
    type: 'sqljs',
    entities,
    synchronize: true,
    autoSave: false,
  }).initialize();
}
