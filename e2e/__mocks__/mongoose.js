import { jest } from '@jest/globals';

const mongoose = jest.createMockFromModule('mongoose');

mongoose.connect = jest.fn().mockReturnValue(Promise.resolve({
  connection: {
    close: () => Promise.resolve(),
  }
}));
mongoose.connection = {
  readyState: 1
}

module.exports = mongoose;