import {
  Button,
  Flex,
  Input,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "../../features/user/type";
import { getToken } from "../../utils/helpers";
import axios from "../../services/api";
import { useForm } from "@mantine/form";

const EditUserForm = () => {
  const { id: roomIdParam } = useParams();
  const userId = parseInt(roomIdParam || "-1");

  const [user, setUser] = useState<User | null>(null);
  const newUser = useForm<User>({
    mode: "uncontrolled",
    initialValues: user ?? undefined,
    validate: {
      phone: (value) =>
        value.length < 10 ? "Số điện thoại không hợp lệ" : null,
      role: (role) =>
        role != "admin" && role != "user" ? "Chọn vai trò" : null,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        if (userId == -1) {
          throw new Error("Not found user id");
        }
        const token = getToken();

        const res = await axios.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { result } = res.data;
        setUser(result);
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Không tải được dữ liệu người dùng",
          confirmButtonColor: "#6ee3a5",
        });
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!user) {
      return;
    }
    newUser.setValues(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveData = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (newUser.validate().hasErrors) {
      return;
    }
    try {
      const token = getToken();
      console.log(newUser.getValues().point);
      await axios.put(`/users/${userId}`, newUser.getValues(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(newUser.getValues());
      Swal.fire({
        icon: "success",
        text: "Cập nhật dữ liệu người dùng thành công",
        confirmButtonColor: "#6EE3A5",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: `Không cập nhật được dữ liệu người dùng`,
        confirmButtonColor: "#6ee3a5",
      });
    }
  };

  return (
    <Stack gap={8} px={16} mt={16}>
      <Input.Wrapper label="Id" description="Id người dùng (chỉ đọc)">
        <Input
          placeholder="User id"
          key={newUser.key("id")}
          {...newUser.getInputProps("id")}
          readOnly
          disabled
        />
      </Input.Wrapper>
      <Input.Wrapper label="Phone">
        <Input
          placeholder="Phone number"
          key={newUser.key("phone")}
          {...newUser.getInputProps("phone")}
        />
      </Input.Wrapper>
      <NumberInput
        label="Point"
        placeholder="Point"
        withAsterisk
        allowNegative={true}
        allowDecimal={false}
        key={newUser.key("point")}
        {...newUser.getInputProps("point")}
      />
      <Input.Wrapper label="Bank name">
        <Input
          placeholder="Bank name"
          key={newUser.key("bankName")}
          {...newUser.getInputProps("bankName")}
        />
      </Input.Wrapper>
      <Input.Wrapper label="Account Number">
        <Input
          placeholder="Account number"
          key={newUser.key("accountNumber")}
          {...newUser.getInputProps("accountNumber")}
        />
      </Input.Wrapper>
      <Input.Wrapper label="Account Holder">
        <Input
          placeholder="Account holder"
          key={newUser.key("accountHolder")}
          {...newUser.getInputProps("accountHolder")}
        />
      </Input.Wrapper>
      <PasswordInput
        placeholder="Password"
        label="Password"
        key={newUser.key("password")}
        {...newUser.getInputProps("password")}
      />
      <Select
        label="Role"
        placeholder="Change user role"
        data={["user", "admin"]}
        key={newUser.key("role")}
        {...newUser.getInputProps("role")}
      />
      <Flex justify={"end"} gap={10}>
        <Button color="green" onClick={handleSaveData}>
          Save
        </Button>
        <Button
          color="red"
          onClick={() => {
            if (!user) {
              return;
            }
            newUser.setValues(user);
          }}
        >
          Reset
        </Button>
      </Flex>
    </Stack>
  );
};

export default EditUserForm;
