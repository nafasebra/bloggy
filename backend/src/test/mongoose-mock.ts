export type MockModel = jest.Mock & {
  find: jest.Mock;
  findById: jest.Mock;
  findOne: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
  countDocuments: jest.Mock;
  deleteOne: jest.Mock;
};

export function createMockModel(): MockModel {
  const chain = {
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockModel = jest.fn((doc?: Record<string, unknown>) => ({
    ...doc,
    save: jest.fn().mockResolvedValue(doc),
  })) as MockModel;

  mockModel.find = jest.fn().mockReturnValue(chain);
  mockModel.findById = jest.fn().mockReturnValue(chain);
  mockModel.findOne = jest.fn();
  mockModel.findByIdAndUpdate = jest.fn();
  mockModel.findByIdAndDelete = jest.fn();
  mockModel.countDocuments = jest.fn();
  mockModel.deleteOne = jest.fn();

  return mockModel;
}
