import React, {useEffect, useState} from "react"
import TokenService from "../../services/TokenService";

const usePermission = () => {

  const initPerms = {
    permissions: [],
    is_superuser: null,
    is_landlord: null,
    is_tenant: null,
  }
  const [permissions, setPermissions] = useState(initPerms);


  useEffect(() => {
    const data = TokenService.getUserPermissions();
    setPermissions(data)
  }, []);


  return permissions
};

export default usePermission;
