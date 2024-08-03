function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export const getXComponent = (property, angle) => {
    angle = degreesToRadians(angle);
    const comp = Math.cos(angle);
    return property * comp;
};

export const getYComponent = (property, angle) => {
    angle = degreesToRadians(angle);
    const comp = Math.sin(angle);
    return property * comp;
};

// x = Vox * t [Xo = 0]
export const getX = (time, initialVelocityXComponent) => {
    return time * initialVelocityXComponent;
};

// y = Voy - 1/2gt^2 [Yo = 0]
export const getY = (time, initialVelocityYComponent, g) => {
    return (initialVelocityYComponent * time) - (0.5 * g * (time * time));
};
