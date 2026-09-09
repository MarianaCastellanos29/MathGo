describe('MathGo E2E Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  // ===== LOGIN =====
  it('debe mostrar el formulario de login', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('debe mostrar error con credenciales incorrectas', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('malo@gmail.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.contains('Correo o contraseña incorrectos').should('be.visible');
  });

  it('debe iniciar sesión correctamente', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
  });

  // ===== HOME =====
  it('debe mostrar los niveles en el home', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.contains('Nivel 1').should('be.visible');
    cy.contains('Nivel 2').should('be.visible');
  });

  it('debe mostrar el nombre del usuario en el home', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.contains('Mariana').should('be.visible');
  });

  it('debe mostrar las vidas en el home', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.contains('❤️').should('exist');
  });

  // ===== NAVEGACIÓN =====
  it('debe navegar a la tienda', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:4200/tienda');
    cy.url().should('include', '/tienda');
    cy.contains('Tienda').should('be.visible');
  });

  it('debe navegar al perfil', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:4200/perfil');
    cy.url().should('include', '/perfil');
    cy.contains('Avatar').should('be.visible');
  });

  it('debe navegar al historial', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:4200/historial');
    cy.url().should('include', '/historial');
    cy.contains('Historial').should('be.visible');
  });

  it('debe navegar a logros', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:4200/logros');
    cy.url().should('include', '/logros');
    cy.contains('Logros').should('be.visible');
  });

  // ===== TIENDA =====
  it('debe mostrar avatares en la tienda', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.visit('http://localhost:4200/tienda');
    cy.contains('Avatares').should('be.visible');
  });

  it('debe mostrar la sección de restablecer vidas en la tienda', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.visit('http://localhost:4200/tienda');
    cy.contains('Restablecer Vidas').should('be.visible');
  });

  // ===== EJERCICIOS =====
  it('debe cargar el nivel 1 de ejercicios', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:4200/ejercicios/1');
    cy.url().should('include', '/ejercicios/1');
    cy.contains('Nivel 1').should('be.visible');
  });

  // ===== LOGOUT =====
  it('debe cerrar sesión correctamente', () => {
    cy.get('input[type="email"], input[placeholder*="correo"], input[name="correo"]').type('mariana@gmail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button').contains(/entrar|ingresar|login/i).click();
    cy.url().should('include', '/home');
    cy.get('button').contains(/salir|logout|cerrar/i).click();
    cy.url().should('include', '/login');
  });

  // ===== REGISTRO =====
  it('debe mostrar el formulario de registro', () => {
    cy.visit('http://localhost:4200/registro');
    cy.url().should('include', '/registro');
    cy.contains(/registro|crear|cuenta/i).should('be.visible');
  });

});