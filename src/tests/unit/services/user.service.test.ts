import { ConflictError, NotFoundError } from '../../../utils/errors'
import User from '../../../entities/user.entity'
import { IUserService } from '../../../interfaces/services.interfaces'
import UserService from '../../../services/user.service'
import { mockUserRepository } from '../../mocks/repo.mocks'
import { UserRole } from '../../../utils/enum/userRole.enum'

describe('User service', () => {
    let userService: IUserService
    const sample_user = {
        email: 'sample@gmail.com',
        fullName: 'Sample',
        password: 'samplepassword',
        role: UserRole.ADMIN
    }
    const user = new User()

    beforeEach(() => {
        userService = new UserService(mockUserRepository)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Should create a user', async () => {
        const createSpy = jest.spyOn(mockUserRepository, 'create')
        const saveSpy = jest.spyOn(mockUserRepository, 'save')
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(null)
            })
        await userService.create({ ...sample_user })

        expect(createSpy).toHaveBeenCalled()
        expect(findByEmailSpy).toHaveBeenCalled()
        expect(saveSpy).toHaveBeenCalled()
    })

    it('Should throw error on create if user with email exists', async () => {
        // const findByEmailSpy = jest.spyOn(mockUserRepository, 'findByEmail')
        expect(async () => {
            await userService.create({ ...sample_user })
        }).rejects.toBeInstanceOf(ConflictError)
    })

    it('Should auth user if password correct', async () => {
        userService._comparePassword = jest.fn().mockResolvedValue(true)
        userService._generateToken = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ accessToken: 'sampletoken ' })
            )
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(user)
            })
        const result = await userService.auth({
            email: 'sample@gmail.com',
            password: 'samplepass',
        })

        expect(findByEmailSpy).toHaveBeenCalled()
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('user')
    })

    it('Should throw not found if user not found', async () => {
        userService._comparePassword = jest.fn().mockResolvedValue(true)
        userService._generateToken = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ accessToken: 'sampletoken ' })
            )
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(null)
            })
        expect(async () => {
            const result = await userService.auth({
                email: 'sample@gmail.com',
                password: 'samplepass',
            })
        }).rejects.toBeInstanceOf(NotFoundError)
    })
})
