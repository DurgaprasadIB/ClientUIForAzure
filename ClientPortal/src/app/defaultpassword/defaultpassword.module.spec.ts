import { DefaultpasswordModule } from './defaultpassword.module';

describe('DefaultpasswordModule', () => {
  let defaultpasswordModule: DefaultpasswordModule;

  beforeEach(() => {
    defaultpasswordModule = new DefaultpasswordModule();
  });

  it('should create an instance', () => {
    expect(defaultpasswordModule).toBeTruthy();
  });
});
