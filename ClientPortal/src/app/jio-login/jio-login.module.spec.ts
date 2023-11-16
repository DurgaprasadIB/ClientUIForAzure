import { JioLoginModule } from './jio-login.module';

describe('JioLoginModule', () => {
  let jioLoginModule: JioLoginModule;

  beforeEach(() => {
    jioLoginModule = new JioLoginModule();
  });

  it('should create an instance', () => {
    expect(jioLoginModule).toBeTruthy();
  });
});
