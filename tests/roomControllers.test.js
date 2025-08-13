const { addRoomControllers } = require('../src/controllers/rooms.controllers.js');
const Room = require('../src/models/Rooms.models.js');

// Mock the Room model
jest.mock('../src/models/Rooms.models.js');


//This will run all the possible test case for adding the room into the database.
describe('This will add the new room type into the database', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        room_type: 'Deluxe',
        room_price: 2000,
        room_ac: true,
        room_minibar: false,
        room_hotwater: true,
        room_breakfast: true,
        room_lunch: false,
        room_dinner: true,
        room_beds: 2
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Room.mockClear(); // clear mocks before each test
  });

  it('should return 400 if room_type or room_price is missing', async () => {
    req.body.room_type = '';
    req.body.room_price = null;

    await addRoomControllers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room type and Room price is required'
    });
  });

  it('should create a room and return 201', async () => {
    const mockSave = jest.fn().mockResolvedValue({ _id: 'abc123' });
    Room.mockImplementation(() => ({
      save: mockSave
    }));

    await addRoomControllers(req, res);

    expect(Room).toHaveBeenCalledWith(expect.objectContaining({
      room_type: 'Deluxe',
      room_price: 2000,
      sgst: 180, // 9% of 2000
      cgst: 180
    }));

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Room added successfully'
    });
  });

  it('should return 500 on internal error', async () => {
    Room.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('DB error'))
    }));

    await addRoomControllers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error'
    });
  });
});



//This test cases will run all the possible test cases for reading the room from the database.

