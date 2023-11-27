import { Mongoose } from 'mongoose'

const mockMongoose = jest.createMockFromModule<Mongoose>('mongoose');

mockMongoose.connect = jest.fn().mockReturnValue(Promise.resolve({
  connection: {
    close: () => Promise.resolve(),
  }
}));
;(mockMongoose as any).connection = {
  readyState: 1
};

module.exports = mockMongoose;