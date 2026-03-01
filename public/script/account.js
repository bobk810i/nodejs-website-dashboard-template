$("#change-password-btn").on('click', (e)=>{
    const oldPassword = $("#account-oldPass").val();
    const newPassword = $("#account-newPass").val();

    if(oldPassword == undefined || newPassword == undefined || oldPassword == '' || newPassword == ''){
        Swal.fire({
            title: "Uzupełnij hasło",
            // text: "Odśwież stronę i spróbuj ponownie",
            icon: "warning"
        });
    }else{
        // check the length
        const minLength = 6;
        if(newPassword.length < minLength){
            Swal.fire({
                title: "Podane hasło jest zbyt krótkie",
                text: `Minimalna liczba znaków to: ${minLength}`,
                icon: "warning"
            });
        }else{

            $.post("/dashboard/changePass", {"oldPass": oldPassword, "newPass": newPassword}, (data, status)=>{
                    if(status != 'success'){
                        Swal.fire({
                            title: "Wystąpił błąd",
                            text: "Odśwież stronę i spróbuj ponownie",
                            icon: "error"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                location.reload();
                            }
                        });
                    }else{
                        if(data.status != 'success'){
                            // sprawdzamy opcje co się stało
                            console.log(data.infoCode);
                            if(data.infoCode == 1){
                                Swal.fire({
                                    title: "Stare hasło jest niepoprawne",
                                    icon: "warning"
                                });
                            }else{
                                Swal.fire({
                                    title: "Wystąpił błąd",
                                    text: "Odśwież stronę i spróbuj ponownie",
                                    icon: "error"
                                }).then((result)=>{
                                    if(result.isConfirmed){
                                        location.reload();
                                    }
                                });
                            }

                        }else{
                            Swal.fire({
                                title: "Hasło zostało zmienione",
                                icon: "success"
                            }).then((result)=>{
                                if(result.isConfirmed){
                                    window.location.href = "/dashboard/logout"
                                }
                            });
                        }
                    }
            });

        }
    }
})