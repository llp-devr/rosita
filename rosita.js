const fs = require('fs');
const vsprintf = require('sprintf-js').vsprintf;
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const express = require('express')
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express()
app.use(fileUpload())
const port = 3000

function SplitLine (line) {
  return line.normalize("NFC").replace('&','&amp;').replace('<','&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", "&apos;").split("|");
};

function EFDtoXML (md5, data) {
  var hierarquia = 0;
  var closeREG = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  };
  var stringXML =vsprintf('<efd-contribuições md5="%s">', md5);

  function inner_closeREG ( nh ) {
    switch(nh) {
      case 0 :
        myArray = [7, 6, 5, 4, 3, 2, 1, 0];
        break;
      case 1 :
        myArray = [7, 6, 5, 4, 3, 2, 1];
        break;
      case 2 :
        myArray = [7, 6, 5, 4, 3, 2];
        break;
      case 3 :
        myArray = [7, 6, 5, 4, 3];
        break;
      case 4 :
        myArray = [7, 6, 5, 4];
        break;
      case 5 :
        myArray = [7, 6, 5];
        break;
      case 6 :
        myArray = [7, 6];
        break;
      case 7 :
        myArray = [7];
        break;
    }

    for (close in myArray) {
      if (closeREG[myArray[close]] != "") {
        stringXML = stringXML + vsprintf('</%s>', closeREG[myArray[close]]);
        closeREG[myArray[close]] = "";
      }
    }
  }

  const lines = data.toString('latin1').split(/\r?\n/)
  for (line in lines) {
    const registro = SplitLine(lines[line])
    switch(registro[1]) {
     
      case "0000" :
        nh = 0
        stringXML = stringXML + vsprintf('<reg_0000 cod_ver="%s" tipo_escrit="%s" ind_sit_esp="%s" num_rec_anterior="%s" dt_ini="%s" dt_fin="%s" name="%s" cnpj="%s" uf="%s" cod_mun="%s" suframa="%s" ind_nat_pj="%s" ind_ativ="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0000";
        break;
      case "0001" :
        nh = 1;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0001";
        break;
      case "0035" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0035 cod_scp="%s" desc_scp="%s" inf_comp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0035";
        break;
      case "0100" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0100 nome="%s" cpf="%s" crc="%s" cnpj="%s" cep="%s" end="%s" num="%s" compl="%s" bairro="%s" fone="%s" fax="%s" email="%s" cod_mun="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0100";
        break;
      case "0110" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0110 cod_inc_trib="%s" ind_apro_cred="%s" cod_tipo_cont="%s" ind_reg_cum="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0110";
        break;
      case "0111" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0111 rec_bru_ncum_trib_mi="%s" rec_bru_ncum_nt_mi="%s" rec_bru_ncum_exp="%s" rec_bru_cum="%s" rec_bru_total="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0111";
        break;
      case "0120" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0120 mes_refer="%s" inf_comp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0120";
        break;
      case "0140" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0140 cod_est="%s" nome="%s" cnpj="%s" uf="%s" ie="%s" cod_mun="%s" im="%s" suframa="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0140";
        break;
      case "0145" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0145 cod_inc_trib="%s" vl_rec_tot="%s" vl_rec_ativ="%s" vl_rec_demais_ativ="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0145";
        break;
      case "0150" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0150 cod_par="%s" nome="%s" cod_pais="%s" cnpj="%s" cpf="%s" ie="%s" cod_mun="%s" suframa="%s" end="%s" num="%s" compl="%s" bairro="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0150";
        break;
      case "0190" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0190 unid="%s" descr="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0190";
        break;
      case "0200" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0200 cod_item="%s" descr_item="%s" cod_barra="%s" cod_ant_item="%s" unid_inv="%s" tipo_item="%s" cod_ncm="%s" ex_ipi="%s" cod_gen="%s" cod_list="%s" aliq_icms="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0200";
        break;
      case "0205" :
        nh = 4;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0205 unid="%s" descr_ant_item="%s" dt_ini="%s" dt_fim="%s" cod_ant_item="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0205";
        break;
      case "0206" :
        nh = 4;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0206 cod_comb="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0206";
        break;
      case "0208" :
        nh = 4;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0208 cod_tab="%s" cod_gru="%s" marca_com="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0208";
        break;
      case "0400" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0400 cod_nat="%s" descr_nat="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0400";
        break;
      case "0450" :
        nh = 3;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0450 cod_inf="%s" txt="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0450";
        break;
      case "0500" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0500 dt_alt="%s" cod_nat_cc="%s" ind_cta="%s" nivel="%s" cod_cta="%s" nome_cta="%s" cod_cta_ref="%s" cnpj_est="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0500";
        break;
      case "0600" :
        nh = 2;
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0600 dt_alt="%s" cod_ccus="%s" ccus="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0600";
        break;
      case "0900" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0900 rec_total_bloco_a="%s" rec_nrb_bloco_a="%s" rec_total_bloco_c="%s" rec_nrb_bloco_c="%s" rec_total_bloco_d="%s" rec_nrb_bloco_d="%s" rec_total_bloco_f="%s" rec_nrb_bloco_f="%s" rec_total_bloco_i="%s" rec_nrb_bloco_i="%s" rec_total_bloco_1="%s" rec_nrb_bloco_1="%s" rec_total_periodo="%s" rec_total_nrb_periodo="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0900";
        break;
      case "0990" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_0990 qtd_lin_0="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_0990";
        break;
      case "A001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A001";
        break;
      case "A010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A010 cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A010";
        break;
      case "A100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A100 ind_oper="%s" ind_emit="%s" cod_par="%s" cod_sit="%s" ser="%s" sub="%s" num_doc="%s" chv_nfse="%s" dt_doc="%s" ind_pgto="%s" vl_desc="%s" vl_bc_pis="%s" vl_pis="%s" vl_bc_cofins="%s" vl_cofins="%s" vl_pis_ret="%s" vl_cofins_ret="%s" vl_iss="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A100";
        break;
      case "A110" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A110 cod_inf="%s" txt_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A110";
        break;
      case "A111" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A111 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A111";
        break;
      case "A120" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A120 vl_tot_serv="%s" vl_bc_pis="%s" vl_pis_imp="%s" st_pag_pis="%s" vl_bc_cofins="%s" vl_cofins_imp="%s" dt_pag_cofins="%s" loc_exe_serv="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A120";
        break;
      case "A170" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A170 num_item="%s" cod_item="%s" descr_compl="%s" vl_item="%s" vl_desc="%s" nat_bc_cred="%s" ind_orig_cred="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins"%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s" cod_ccus="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A170";
        break;
      case "A990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_A990 qtd_lin_A="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_A990";
        break;
      case "C001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C001";
        break;
      case "C010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C010 cnpj="%s" ind_escri="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C010";
        break;
      case "C100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C100 ind_oper="%s" ind_emit="%s" cod_part="%s" cod_mod="%s" cod_sit="%s" cod_ser="%s" num_doc="%s" chv_nfe="%s" dt_doc="%s" dt_e_s="%s" vl_doc="%s" ind_pgto="%s" vl_desc="%s" vl_abat_nt="%s" vl_merc="%s" ind_frt="%s" vl_frt="%s" vl_seg="%s" vl_out_da="%s" vl_bc_icms="%s" vl_icms="%s" vl_bc_icms_st="%s" vl_icms_st="%s" vl_ipi="%s" vl_pis="%s" vl_cofins="%s" vl_pis_st="%s" vl_cofins_st="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C100";
        break;
      case "C110" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C110 cod_inf="%s" txt_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C110";
        break;
      case "C111" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C111 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C111";
        break;
      case "C120" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C120 cod_doc_imp="%s" num_doc_imp="%s" vl_pis_imp="%s" vl_cofins_imp="%s" num_acdraw="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C120";
        break;
      case "C170" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<regC170 num_item="%s" cod_item="%s" descr_compl="%s" qtd="%s" unid="%s" vl_item="%s" vl_desc="%s" ind_mov="%s" cst_icms="%s" cfop="%s" cod_nat="%s" vl_bc_icms="%s" aliq_icms="%s" vl_icms="%s" vl_bc_icms_st="%s" aliq_st="%s" vl_icms_st="%s" ind_apur="%s" cst_ipi="%s" cod_enq="%s" vl_bc_ipi="%s" aliq_ipi="%s" vl_ipi="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C170";
        break;
      case "C175" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C175 cfop="%s" vl_opr="%s" vl_desc="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C175";
        break;
      case "C180" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C180 cod_mod="%s" dt_doc_ini="%s" dt_doc_fin="%s" cod_item="%s" cod_ncm="%s" ex_ipi="%s" vl_tot_item="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C180";
        break;
      case "C181" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C181 cst_pis="%s" cfop="%s" vl_item="%s" vl_desc="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C181";
        break;
      case "C185" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C185 cst_cofins="%s" cfop="%s" vl_item="%s" vl_desc="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C185";
        break;
      case "C188" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C188 num_porc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C188";
        break;
      case "C190" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C190 dt_ref_ini="%s" dt_ref_fin="%s" cod_item="%s" cod_ncm="%s" ex_ipi="%s" vl_tot_item="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C190";
        break;
      case "C191" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C191 cnpj_cpf_part="%s" cst_pis="%s" cfop="%s" vl_item="%s" vl_desc="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C191";
        break;
      case "C195" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C195 cnpj_cpf_part="%s" cst_cofins="%s" cfop="%s" vl_item="%s" vl_desc="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C195";
        break;
      case "C198" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C198 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C198";
        break;
      case "C199" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C199 cod_doc_imp="%s" num_doc_imp="%s" vl_pis_imp="%s" num_acdraw="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C199";
        break;
      case "C380" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C380 cod_doc_imp="%s" cod_mod="%s" dt_doc_ini="%s" dt_doc_fin="%s" num_doc_ini="%s" num_doc_fin="%s" vl_doc="%s" vl_doc_cnc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C380";
        break;
      case "C381" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C381 cst_pis="%s" cod_item="%s" vl_item="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C381";
        break;
      case "C385" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C385 cst_cofins="%s" cod_item="%s" vl_item="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C385";
        break;
      case "C395" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C395 cod_mod="%s" cod_part="%s" ser="%s" ser_sub="%s" num_doc="%s" dt_doc="%s" vl_doc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C395";
        break;
      case "C396" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C396 cod_item="%s" vl_item="%s" vl_desc="%s" nat_bc_cred="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C396";
        break;
      case "C400" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C400 cod_mod="%s" ecf_mod="%s" ecf_fab="%s" ecf_cx="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C400";
        break;
      case "C405" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C405 dt_doc="%s" cro="%s" crz="%s" num_coo_fin="%s" gt_fin="%s" vl_brt="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C405";
        break;
      case "C481" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C481 cst_pis="%s" vl_item="%s" vl_bc_pis="%s" aliq_pis="%s" quant-bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cod_item="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C481";
        break;
      case "C485" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C485 cst_cofins="%s" vl_item="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant-bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_item="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C485";
        break;
      case "C489" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C489 cnum_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C489";
        break;
      case "C490" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C490 dt_doc_ini="%s" dt_doc_fin="%s" cod_mod="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C490";
        break;
      case "C491" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C491 cod_item="%s" cst_pis="%s" cfop="%s" vl_item="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C491";
        break;
      case "C495" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C495 cod_item="%s" cst_cofins="%s" cfop="%s" vl_item="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C495";
        break;
      case "C499" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C499 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C499";
        break;
      case "C500" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C500 cod_part="%s" cod_mod="%s" cod_sit="%s" ser="%s" sub="%s" num_doc="%s" dt_doc="%s" dt_ent="%s" vl_doc="%s" vl_icms="%s" cod_inf="%s" vl_pis="%s" vl_cofins="%s" chv_doce="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C500";
        break;
      case "C501" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C501 cst_pis="%s" vl_item="%s" nat_bc_cred="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C501";
        break;
      case "C505" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C501 cst_cofins="%s" vl_item="%s" nat_bc_cred="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C501";
        break;
      case "C509" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C509 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C509";
        break;
      case "C600" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C600 cod_mod="%s" cod_mun="%s" ser="%s" sub="%s" cod_cons="%s" qtd_cons="%s" qtd_canc="%s" dt_doc="%s" vl_doc="%s" vl_desc="%s" cons="%s" vl_forn="%s" vl_serv_nt="%s" vl_terc="%s" vl_da="%s" vl_bc_icms="%s" vl_icms="%s" vl_bc_icms_st="%s" vl_icms_st="%s" vl_pis="%s" vl_cofins="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C600";
        break;
      case "C601" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C601 cod_mod="%s" cst_pis="%s" vl_item="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C601";
        break;
      case "C605" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C605 cod_mod="%s" cst_cofins="%s" vl_item="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C605";
        break;
      case "C609" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C609 cod_mod="%s" num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C609";
        break;

      //case "C800" :  //-- Inativo
      //case "C810" :  //-- Inativo
      //case "C820" :  //-- Inativo 
      //case "C830" :  //-- Inativo 

      case "C860" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C860 cod_mod="%s" nr_sat="%s" dt_doc="%s" doc_ini="%s" doc_fim="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C860";
        break;
      case "C870" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C870 cod_item="%s" cfop="%s" vl_item="%s" vl_desc="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C870";
        break;
      case "C880" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C880 cod_item="%s" cfop="%s" vl_item="%s" vl_desc="%s" cst_pis="%s" quant_bc_pis_quant="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C880";
        break;
      case "C890" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C890 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C890";
        break;
      case "C990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_C990 qtd_lin_C="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_C990";
        break;
      case "D001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D001";
        break;
      case "D010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D010 cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D010";  
        break;
      case "D100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D100 ind_oper="%s" ind_emit="%s" cod_part="%s" cod_mod="%s" cod_sit="%s" ser="%s" sub="%s" num_doc="%s" chv_cte="%s" dt_doc="%s" dt_a_p="%s" tp_cte="%s" chv_cte_ref="%s" vl_doc="%s" vl_desc="%s" ind_frt="%s" vl_serv="%s" vl_bc_icms="%s" vl_icms="%s" vl_nt="%s" cod_inf="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D100";
        break;
      case "D101" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D101 ind_nat_frt="%s" vl_item="%s" cst_pis="%s" nat_bc_cred="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D101";
        break;
      case "D105" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D105 ind_nat_frt="%s" vl_item="%s" cst_cofins="%s" nat_bc_cred="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D105";
        break;
      case "D111" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D111 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D111";
        break;
      case "D200" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D200 cod_mod="%s" cod_sit="%s" ser="%s" sub="%s" num_doc_ini="%s" num_doc_fin="%s" cfop="%s" dt_ref="%s" vl_doc="%s" vl_desc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D200";
        break;
      case "D201" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D201 cst_pis="%s" vl_item="%s" vl_bc_pis="%s" aliq_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D201";
        break;
      case "D205" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D205 cst_cofins="%s" vl_item="%s" vl_bc_cofins="%s" aliq_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D205"
        break;
      case "D209" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D209 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D209"
        break;
      case "D300" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D300 cod_mod="%s" ser="%s" sub="%s" num_doc_ini="%s" num_doc_fin="%s" cfop="%s" dt_ref="%s" vl_doc="%s" vl_desc="%s"cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D300"
        break;
      case "D309" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D309 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D309"
        break;
      case "D350" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D350 cod_mod="%s" ecf_mod="%s" ecf_fab="%s" dt_doc="%s" cro="%s" crz="%s" num_coo_fin="%s" gt_fin="%s" vl_brt="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D350"
        break;
      case "D359" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D359 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D359"
        break;
      case "D500" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D500 ind_oper="%s" ind_emit="%s" cod_part="%s" cod_mod="%s" cod_sit="%s" ser="%s" sub="%s" num_doc="%s" dt_doc="%s" dt_a_p="%s" vl_doc="%s" vl_desc="%s" vl_serv="%s" vl_serv_st="%s" vl_terc="%s" vl_da="%s" vl_bc_icms="%s" vl_icms="%s" cod_inf="%s" vl_pis="%s" vl_cofins="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D500"
        break;
      case "D501" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D501 cst_pis="%s" vl_item="%s" nat_bc_cred="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D501"
        break;
      case "D505" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D505 cst_cofins="%s" vl_item="%s" nat_bc_cred="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D505"
        break;
      case "D509" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D509 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D509"
        break;
      case "D600" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D600 cod_mod="%s" cod_mun="%s" ser="%s" sub="%s" ind_rec="%s" qtd_cons="%s" dt_doc_ini="%s" dt_doc_fin="%s" vl_doc="%s" vl_desc="%s" vl_serv="%s" vl_serv_nt="%s" vl_terc="%s" vl_da="%s" vl_bc_icms="%s" vl_icms="%s" vl_pis="%s" vl_cofins="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D600"
        break;
      case "D601" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D601 cod_class="%s" vl_item="%s" vl_desc="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D601"
        break;
      case "D605" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D605 cod_class="%s" vl_item="%s" vl_desc="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D605"
        break;
      case "D609" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D609 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D609"
        break;
      case "D990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_D990 qtd_lin_D="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_D990"
        break;
      case "F001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F001"
        break;
      case "F010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F010 cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F010"
        break;
      case "F100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F100 ind_oper="%s" cod_part="%s" cod_item="%s" dt_oper="%s" vl_oper="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" nat_bc_cred="%s" ind_orig_cred="%s" cod_cta="%s" cod_ccus="%s" desc_doc_oper="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F100"
        break;
      case "F111" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F111 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F111"
        break;
      case "F120" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F120 nat_bc_cred="%s" ident_bem_imob="%s" ind_orig_cred="%s" ind_util_bem_imob="%s" vl_oper_dep="%s" parc_oper_nao_bc_cred="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s" cod_ccus="%s" desc_bem_imob="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F120"
        break;
      case "F129" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F129 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F129"
        break;
      case "F130" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F130 nat_bc_cred="%s" ident_bem_imob="%s" ind_orig_cred="%s" ind_util_bem_imob="%s" mes_oper_aquis="%s" vl_oper_aquis="%s" parc_oper_nao_bc_cred="%s" vl_bc_cred="%s" ind_nr_parc="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cred="%s" vl_cofins="%s" cod_cta="%s" cod_ccus="%s" desc_bem_imob="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F130"
        break;
      case "F139" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F139 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F139"
        break;
      case "F150" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F150 nat_bc_cred="%s" vl_tot_est="%s" est_imp="%s" vl_bc_est="%s" vl_bc_men_est="%s" cst_pis="%s" aliq_pis="%s" vl_cred_pis="%s" cst_cofins="%s" aliq_cofins="%s" vl_cred_cofins="%s" desc_est="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F150"
        break;
      case "F200" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F200 ind_oper="%s" unid_mob="%s" ident_emp="%s" desc_unid_imob="%s" num_cont="%s" cpf_cnpj_adqu="%s" dt_oper="%s" vl_tot_vend="%s" vl_rec_acum="%s" vl_tot_rec="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" perc_rec_receb="%s" ind_nat_emp="%s" inf_comp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F200"
        break;
      case "F205" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F205 vl_cus_inc_acum_ant="%s" vl_cus_inc_per_esc="%s" vl_cus_inc_acum="%s" vl_exc_bc_cus_inc_acum="%s" vl_bc_cus_inc="%s" cst_pis="%s" vl_cred_pis_acum="%s" vl_cred_pis_desc_ant="%s" vl_cred_pis_desc_fut="%s" aliq_cofins="%s" vl_cred_cofins_acum="%s" vl_cred_cofins_desc_ant="%s" vl_cred_cofins_desc="%s" vl_cred_cofins_fut="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F205"
        break;
      case "F210" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F210 vl_cus_orc="%s" vl_exc="%s" vl_cus_orc_aju="%s" vl_bc_cred="%s" cst_pis="%s" aliq_pis="%s" vl_cred_pis_util="%s" cst_cofins="%s" aliq_cofins="%s" vl_cred_cofins_util="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F210"
        break;
      case "F211" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F211 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F211"
        break;
      case "F500" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F500 vl_rec_caixa="%s" cst_pis="%s" vl_desc_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_desc_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_mod="%s" cfop="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F500"
        break;
      case "F509" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F509 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F509"
        break;
      case "F510" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F510 vl_rec_caixa="%s" cst_pis="%s" vl_desc_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" vl_desc_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_mod="%s" cfop="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F510"
        break;
      case "F519" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F519 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F519"
        break;
      case "F525" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F525 vl_rec="%s" ind_rec="%s" cnpj_cpf="%s" num_doc="%s" cod_item="%s" vl_rec_det="%s" cst_pis="%s" cst_cofins="%s" info_compl="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F525"
        break;
      case "F550" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F550 vl_rec_comp="%s" cst_pis="%s" vl_desc_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cst_cofins="%s" vl_desc_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_mod="%s" cfop="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F550"
        break;
      case "F559" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F559 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F559"
        break;
      case "F560" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F560 vl_rec_comp="%s" cst_pis="%s" vl_desc_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_pis="%s" cst_cofins="%s" vl_desc_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_cofins="%s" cod_mod="%s" cfop="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F560"
        break;
      case "F569" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F569 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F569"
        break;
      case "F600" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F600 ind_nat_ret="%s" dt_ret="%s" vl_bc_ret="%s" vl_ret="%s" cod_rec="%s" ind_nat_rec="%s" cnpj="%s" vlt_ret_pis="%s" vlt_ret_cofins="%s" ind_rec="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F600"
        break;
      case "F700" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F700 ind_ori_ded="%s" ind_nat_ded="%s" vl_ded_pis="%s" vl_ded_cofins="%s" vl_bc_oper="%s" cnpj="%s" inf_comp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F700"
        break;
      case "F800" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F800 ind_nat_even="%s" cnpj_suced="%s" pa_cont_cred="%s" cod_cred="%s" vl_cred_pis="%s" vl_cred_cofins="%s" per_cred_cis="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F800"
        break;
      case "F990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_F990 qtd_lin_F="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_F990"
        break;
      case "I001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I001"
        break;
      case "I010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I010 cnpj="%s" ind_ativ="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I010"
        break;
      case "I100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I100 vl_rec="%s" cst_pis_cofins="%s" vl_tot_ded_ger="%s" vl_tot_ded_esp="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I100"
        break;
      case "I199" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I199 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I199"
        break;
      case "I200" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I200 num_campo="%s" cod_det="%s" det_valor="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I200"
        break;
      case "I299" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I299 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I299"
        break;
      case "I300" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I300 cod_comp="%s" det_valor="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I300"
        break;
      case "I399" :
        nh = 6
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I399 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I399"
        break;
      case "I990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_I990 qtd_lin_I="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_I990"
        break;
      case "M001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M001"
        break;
      case "M100" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M100 cod_cred="%s" ind_cred_ori="%s" vl_bc_pis="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_cred="%s" vl_ajus_acres="%s" vl_ajus_reduc="%s" vl_cred_dif="%s" vl_cred_disp="%s" ind_desc_cred="%s" vl_cred_desc="%s" sld_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M100"
        break;
      case "M105" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M105 nat_bc_cred="%s" cst_pis="%s" vl_bc_tot="%s" aliq_pis="%s" vl_bc_pis_cum="%s" vl_bc_pis_nc="%s" vl_bc_pis="%s" quant_bc_pis_tot="%s" quant_bc_pis="%s" desc_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M105"
        break;
      case "M110" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M110 ind_aj="%s" vl_aj="%s" cod_aj="%s" num_doc="%s" descr_aj="%s" dt_ref="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M110"
        break;
      case "M115" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M115 dt_valor_aj="%s" cst_pis="%s" det_bc_cred="%s" det_aliq="%s" dt_oper_aj="%s" desc_aj="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M115"
        break;
      case "M200" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M200 vl_tot_cont_nc_per="%s" vl_tot_cred_desc="%s" vl_tot_cred_desc_ant="%s" vl_tot_cont_nc_dev="%s" vl_ret_nc="%s" vl_out_ded_nc="%s" vl_cont_nc_rec="%s" vl_tot_cont_cum_per="%s" vl_ret_cum="%s" vl_out_ded_cum="%s" vl_count_cum_rec="%s" vl_tot_cont_rec="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M200"
        break;
      case "M205" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M205 num_campo="%s" cod_rec="%s" vl_debito="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M205"
        break;
      case "M210" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M210 cod_cont="%s" vl_rec_brt="%s" vl_bc_cont="%s" vl_ajus_acres_bc_pis="%s" vl_ajus_reduc_bc_pis="%s" vl_bc_cont_ajus="%s" aliq_pis="%s" quant_bc_pis="%s" aliq_pis_quant="%s" vl_cont_apur="%s" vl_ajus_acres="%s" vl_ajus_reduc="%s" vl_cont_difer="%s" vl_cont_difer_ant="%s" vl_cont_per="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M210"
        break;
      case "M211" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M211 ind_tip_coop="%s" vl_bc_cont_ant_exc_coop="%s" vl_exc_coop_ger="%s" vl_exc_esp_coop="%s" vl_bc_cont="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M211"
        break;
      case "M215" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M215 ind_aj_bc="%s" vl_aj_bc="%s" cod_aj_bc="%s" num_doc="%s" descr_aj_bc="%s" dt_ref="%s" cod_cta="%s" cnpj="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M215"
        break;
      case "M220" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M220 ind_aj="%s" vl_aj="%s" cod_aj="%s" num_doc="%s" descr_aj="%s" dt_ref="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M220"
        break;
      case "M225" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M225 det_valor_aj="%s" cst_pis="%s" det_bc_cred="%s" det_aliq="%s" dt_oper_aj="%s" desc_aj="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M225"
        break;
      case "M230" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M230 cnpj="%s" vl_vend="%s" vl_nao_receb="%s" vl_cont_dif="%s" vl_cred_dif="%s" cod_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M230"
        break;
      case "M300" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M300 cod_cont="%s" vl_cont_apur_difer="%s" nat_cred_desc="%s" vl_cred_desc_difer="%s" vl_cont_difer_ant="%s" per_apur="%s" dt_receb="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M300"
        break;
      case "M350" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M350 vl_tot_fol="%s" vl_exc_bc="%s" vl_tot_bc="%s" aliq_pis_fol="%s" vl_tot_cont_fol="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M350"
        break;
      case "M400" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M400 cst_pis="%s" vl_tot_rec="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M400"
        break;
      case "M410" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M410 nat_rec="%s" vl_rec="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M410"
        break;
      case "M500" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M500 cod_cred="%s" ind_cred_ori="%s" vl_bc_cofins="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s"  vl_ajus_acres="%s" vl_ajus_reduc="%s" vl_creds_difer="%s" vl_cred_disp="%s" ind_desc_cred="%s" sld_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M500"
        break;
      case "M505" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M505 nat_bc_cred="%s" cst_cofins="%s" vl_bc_cofins_tot="%s" vl_bc_cofins_cum="%s" vl_bc_cofins_nc="%s" vl_bc_cofins="%s" quant_bc_cofins_tot="%s" quant_bc_cofins="%s" desc_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M505"
        break;
      case "M510" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M510 ind_aj="%s" vl_aj="%s" cod_aj="%s" num_doc="%s" descr_aj="%s" dt_ref="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M510"
        break;
      case "M515" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M515 det_valor_aj="%s" cst_cofins="%s" det_bc_cred="%s" det_aliq="%s" det_oper_aj="%s" desc_aj="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M515"
        break;
      case "M600" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M600 det_valor_aj="%s" vl_tot_cont_nc_per="%s" vl_tot_cred_desc="%s" vl_tot_cred_desc_ant="%s" vl_tot_cont_nc_dev="%s" vl_ret_nc="%s" vl_out_ded_nc="%s" vl_cont_nc_rec="%s" vl_tot_cont_cur_per="%s" vl_ret_cum="%s" vl_out_ded_cum="%s" vl_cont_cum_rec="%s" vl_tot_cont_rec="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M600"
        break;
      case "M605" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M605 num_campo="%s" cod_cred="%s" vl_debito="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M605"
        break;
      case "M610" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M610 cod_cont="%s" vl_rec_brt="%s" vl_bc_cont="%s" vl_ajus_acres_bc_cofins="%s" vl_ajus_reduc_bc_cofins="%s" vl_bc_cont_ajus="%s" aliq_cofins="%s" quant_bc_cofins="%s" aliq_cofins_quant="%s" vl_quant_apur="%s" vl_ajus_acres="%s" vl_ajus_reduc="%s" vl_cont_difer="%s" vl_cont_difer_ant="%s" vl_cont_per="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M610"
        break;
      case "M611" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M611 ind_tip_coop="%s" vl_bc_cont_ant_exc_coop="%s" vl_bc_cont="%s" vl_exc_coop_ger="%s" vl_exc_esp_coop="%s" vl_bc_cont="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M611"
        break;
      case "M615" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M615 ind_aj_bc="%s" vl_aj_bc="%s" cod_aj_bc="%s" num_doc="%s" descr_aj_bc="%s" dt_ref="%s" cod_cta="%s" cnpj="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M615"
        break;
      case "M620" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M620 ind_aj="%s" vl_aj="%s" cod_aj="%s" num_doc="%s" descr_aj="%s" dt_ref="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M620"
        break;
      case "M625" :
        nh = 5
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M625 det_valor_aj="%s" cst_cofins="%s" det_bc_cred="%s" det_aliq="%s" det_oper_aj="%s" desc_aj="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M625"
        break;
      case "M630" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M630 cnpj="%s" vl_vend="%s" vl_nao_receb="%s" vl_cont_dif="%s" vl_cred_dif="%s" cod_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M630"
        break;
      case "M700" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M700 cod_cont="%s" vl_cont_apur_difer="%s" nat_cred_desc="%s" vl_cred_desc_difer="%s" vl_cont_difer_ant="%s" per_apur="%s" dt_receb="%s>', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M700"
        break;
      case "M800" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M800 cst_cofins="%s" vl_tot_rec="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M800"
        break;
      case "M810" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M810 nat_rec="%s" vl_rec="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M810"
        break;
      case "M990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_M990 qtd_lin_M="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_M990"
        break;
      case "P001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P001"
        break;
      case "P010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P010 cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P010"
        break;
      case "P100" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P100 dt_ini="%s" dt_fin="%s" vl_rec_tot_est="%s" cod_ativ_econ="%s" vl_rec_ativ_estab="%s" vl_exc="%s" vl_bc_cont="%s" aliq_cont="%s" vl_cont_apu="%s" cod_cta="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P100"
        break;
      case "P110" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P110 num_campo="%s" cod_det="%s" dt_valor="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P110"
        break;
      case "P199" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P199 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P199"
        break;
      case "P200" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P200 per_ref="%s" vl_tot_cont_apu="%s" vl_tot_aj_reduc="%s" vl_tot_aj_acres="%s" vl_tot_cont_dev="%s" cod_rec="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P200"
        break;
      case "P210" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P210 ind_aj="%s" vl_aj="%s" cod_aj="%s" num_doc="%s" descr_aj="%s" dt_ref="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P210"
        break;
      case "P990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_P990 qtd_lin_P="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_P990"
        break;
      case "1001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1001"
        break;
      case "1010" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1010 num_proc="%s" ind_sec_jud="%s" ind_vara="%s" ind_nat_acao="%s" desc_dec_jud="%s" dt_sent_jud="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1010"
        break;
      case "1011" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1011 reg_ref="%s" chave_doc="%s" cod_part="%s" cod_item="%s" dt_oper="%s" vl_oper="%s" cst_pis="%s" vl_bc_pis="%s" aliq_oper="%s" vl_pis="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cst_pis_susp="%s" vl_bc_pis_susp="%s" aliq_pis_susp="%s" vl_pis_susp="%s" cst_cofins_susp="%s" vl_bc_cofins_susp="%s" aliq_cofins_susp="%s" vl_cofins_susp="%s" cod_cta="%s" cod_ccus="%s" desc_doc_oper="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1011"
        break;
      case "1020" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1020 num_proc="%s" ind_nat_acao="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1020"
        break;
      case "1050" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1050 dt_ref="%s" ind_aj_bc="%s" cnpj="%s" vl_aj_tot="%s" vl_aj_cst01="%s" vl_aj_cst02="%s" vl_aj_cst03="%s" vl_aj_cst04="%s" vl_aj_cst05="%s" vl_aj_cst06="%s" vl_aj_cst07="%s" vl_aj_cst08="%s" vl_aj_cst09="%s" vl_aj_cst49="%s" vl_aj_cst99="%s" ind_aprop="%s" num_rec="%s" info_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1050"
        break;
      case "1100" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1100 per_apu_cred="%s" orig_cred="%s" cnpj_suc="%s" cod_cred="%s" vl_cred_apu="%s" vl_cred_ext_apu="%s" vl_tot_cred_apu="%s" vl_cred_desc_pa_ant="%s" vl_cred_dcomp_pa_ant="%s" sd_cred_disp_efd="%s" vl_cred_desc_efd="%s" vl_cred_perc_efd="%s" vl_cred_dcomp_efd="%s" vl_cred_trans="%s" vl_cred_out="%s" sld_cred_fim="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1100"
        break;
      case "1101" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1101 cod_part="%s" cod_item="%s" cod_mod="%s" ser="%s" sub_ser="%s" num_doc="%s" dt_oper="%s" chv_nfe="%s" vl_oper="%s" cfop="%s" nat_bc_cred="%s" ind_orig_cred="%s" cst_pis="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s" cod_ccus="%s" desc_compl="%s" per_escrit="%s" cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1101"
        break;
      case "1102" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1102 vl_cred_pis_trib_mi="%s" vl_cred_pis_nt_mi="%s" vl_cred_pis_exp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1102"
        break;
      case "1200" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1200 per_apur_ant="%s" nat_cont_rec="%s" vl_cont_apur="%s" vl_cred_pis_desc="%s" vl_cont_dev="%s" vl_out_ded="%s" vl_cont_exp="%s" vl_mul="%s" vl_jur="%s" dt_recol="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1200"
        break;
      case "1210" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1210 cnpj="%s" cst_pis="%s" cod_part="%s" dt_oper="%s" vl_oper="%s" vl_bc_pis="%s" aliq_pis="%s" vl_pis="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1210"
        break;
      case "1220" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1220 per_apu_cred="%s" orig_cred="%s" cod_cred="%s" vl_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1220"
        break;
      case "1300" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1300 ind_nat_ret="%s" pr_rec_ret="%s" vl_ret_apu="%s" vl_ret_ded="%s" vl_ret_per="%s" vl_ret_dcomp="%s" sld_ret="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1300"
        break;
      case "1500" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1500 per_apu_cred="%s" orig_cred="%s" cnpj_suc="%s" cod_cred="%s" vl_cred_apu="%s" vl_cred_ext_apu="%s" vl_tot_cred_apu="%s" vl_cred_exp_apu="%s" vl_tot_cred_apu="%s" vl_cred_desc_pa_ant="%s" vl_cred_per_pa_ant="%s" vl_cred_dcomp_pa_ant="%s" sd_cred_disp_efd="%s" vl_cred_desc_efd="%s" vl_cred_per_efd="%s" vl_cred_dcomp_efd="%s" vl_cred_trans="%s" vl_cred_out="%s" sld_cred_fim="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1500"
        break;
      case "1501" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1501 cod_part="%s" cod_item="%s" cod_mod="%s" ser="%s" sub_ser="%s" num_doc="%s" dt_oper="%s" chv_nfe="%s" vl_oper="%s" cfop="%s" vnat_bc_cred="%s" ind_orig_cred="%s" cst_cofins="%s" vl_bc_cofins="%s" aliq_cofins="%s" vl_cofins="%s" cod_cta="%s" cos_ccus="%s" desc_compl="%s" per_escrit="%s" cnpj="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1501"
        break;
      case "1502" :
        nh = 4
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1502 vl_cred_cofins_trib_mi="%s" vl_cred_cofins_nt_mi="%s" vl_cred_cofins_exp="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1502"
        break;
      case "1600" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1600 per_apu_ant="%s" nat_cont_rec="%s" vl_cont_apur="%s" vl_cred_cofins_desc="%s" vl_cont_dev="%s" vl_out_ded="%s" vl_cont_ext="%s" vl_mul="%s" vl_jur="%s" dt_recol="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1600"
        break;
      case "1610" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1610 cnpj="%s" cst_cofins="%s" cod_part="%s" dt_oper="%s" vl_oper="%s" vl_bc_cofins="%s" aliq_cofins="%s" vlcofins="%s" cod_cta="%s" desc_compl="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1610"
        break;
      case "1620" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1620 per_apu_cred="%s" orig_cred="%s" cod_cred="%s" vl_cred="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1620"
        break;
      case "1700" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1700 ind_nat_ret="%s" per_rec_ret="%s" vl_ret_apu="%s" vl_ret_ded="%s" vl_ret_per="%s" vl_ret_dcomp="%s" sld_ret="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1700"
        break;
      case "1800" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1800 inc_iomb="%s" rec_receb_ret="%s" rec_fin_ret="%s" bc_ret="%s" aliq_ret="%s" vl_rec_uni="%s" dt_rec_uni="%s" cod_rec="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1800"
        break;
      case "1809" :
        nh = 3
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1809 num_proc="%s" ind_proc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1809"
        break;
      case "1900" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1900 cnpj="%s" cod_mod="%s" ser="%s" sub_ser="%s" cod_sit="%s" vl_tot_rec="%s" quant_doc="%s" cst_pis="%s" cst_cofins="%s" cfop="%s" inf_compl="%s" cod_cta="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1900"
        break;
      case "1990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_1990 qtd_lin_1="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_1990"
        break;
      case "9001" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_9001 ind_mov="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_9001";
        break;
      case "9900" :
        nh = 2
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_9900 reg_blc="%s" qtd_reg_blc="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_9900";
        break;
      case "9990" :
        nh = 1
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_9990 qtd_lin_9="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_9990";
        break;
      case "9999" :
        nh = 0
        inner_closeREG(nh);
        stringXML = stringXML + vsprintf('<reg_9999 qtd_lin="%s">', registro.slice(2, -1));
        hierarquia = nh;
        closeREG[nh] = "reg_9999";
        break;
    }
  };

  inner_closeREG(0);
  stringXML = stringXML + '</efd-contribuições>';
  parser = new DOMParser();

  xmlDoc = parser.parseFromString(stringXML,"application/xml");
  
  const serializer = new XMLSerializer();
  
  const xmlString = serializer.serializeToString(xmlDoc);
         
  return xmlString;
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/efd-contribuicoes", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const fileData = req.files.sped.data;
  const fileHash = req.files.sped.md5;
  console.log(fileData)
  return res.send(EFDtoXML(fileHash, fileData))
})

app.listen(port, () => {
  console.log('Example app listening')
})
