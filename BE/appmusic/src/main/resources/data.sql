INSERT INTO roles (role_name) VALUES ('ROLE_ADMIN'), ('ROLE_USER');

INSERT INTO users (username, password, first_name, last_name, email, phone, avatar_url, gender, age)
VALUES ('admin', '$2a$10$5dNctV3S2FnzQJpa0a/Nv.q/LzoB2SCf3oFJ5Msjz3092nl/T0JNO', 'Hoang Anh', 'Nguyen Huy', 'admin@gmail.com', '9876543210', 'https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg', 'MALE', 23);

INSERT INTO users_roles (user_id, role_id)
SELECT users.id, roles.id
FROM users
CROSS JOIN roles
WHERE roles.role_name IN ('ROLE_ADMIN', 'ROLE_USER')
AND users.username = 'admin';
