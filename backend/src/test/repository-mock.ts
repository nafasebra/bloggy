export function createMockRepository() {
  return {
    create: jest.fn((dto: object) => ({ ...dto })),
    save: jest.fn((dto: object) => Promise.resolve(dto)),
    merge: jest.fn(
      (entity: object, ...dtos: object[]) =>
        Object.assign(entity, ...dtos) as object
    ),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    countBy: jest.fn().mockResolvedValue(0),
    manager: {
      transaction: jest.fn<
        Promise<unknown>,
        [(manager: unknown) => Promise<unknown>]
      >(),
    },
  };
}
